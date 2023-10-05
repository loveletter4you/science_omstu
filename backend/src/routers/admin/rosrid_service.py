from sqlalchemy.ext.asyncio import AsyncSession as Session
import requests
import time
import json
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession as Session

from src.model.model import Identifier, PriorityDirections, OrganizationIdentifier, Organization, Nioktr
from src.utils.aiohttp import SingletonAiohttp
from src.model.storage import get_or_create_organization_omstu, get_or_create_budget_type, get_or_create_types_n, get_nioktr_by_name, create_nioktr

uid = []
uid.append('9569096') #ОмГТУ
start_date = '2022-11-30'
end_date = '2023-12-31'
# URL API, который осуществляет поиск по ИС
search_url = 'https://rosrid.ru/api/base/search'
# Формируем заготовку для основного тела поиска
payload = {
    "search_query": None,
    "critical_technologies": [],
    "dissertations": False,
    "full_text_available": False,
    "ikrbses": False,
    "nioktrs": True,
    "organization": uid,
    "page": 1,
    "priority_directions": [],
    "rids": False,
    "rubrics": [],
    "search_area": "Во всех полях",
    "sort_by": "Дата регистрации",
    "open_license": False,
    "free_licenses": False,
    "expert_estimation_exist": False,
    "start_date": start_date,
    "end_date": end_date
}

# Создаём сессию и проставляем стандартные заголовки, что бы не сильно отличаться от браузера
session = requests.session()
session.headers.update({
    'authority': 'rosrid.ru',
    'pragma': 'no-cache',
    'cache-control': 'no-cache',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
    'accept': 'application/json, text/plain, */*',
    'sec-ch-ua-mobile': '?0',
    'content-type': 'application/json;charset=UTF-8',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'sec-ch-ua-platform': '"Linux"',
    'origin': 'https://rosrid.ru',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://rosrid.ru/global-search',
    'accept-language': 'ru,en-US;q=0.9,en;q=0.8,ru-RU;q=0.7'
})


async def get_search_results(db: Session, data, timeout=1):
    identifier_nioktr_result = await db.execute(select(Identifier).filter(Identifier.name == "Nioktr"))
    identifier_nioktr = identifier_nioktr_result.scalars().first()
    organization_omstu = await get_or_create_organization_omstu(db)
    budget_type = await get_or_create_budget_type("test", db)
    types_n = await get_or_create_types_n("test", db)
    items_in_page = 10
    search_results = []

    try:
        resp = session.request("POST", search_url, data=json.dumps(data, ensure_ascii=False).encode('utf-8'))
        if resp.status_code == 200:
            json_resp = resp.json()

            # print(type(json_resp))
            # budget = json_resp['hits']['_source']
            # print(type(json_resp['hits']['hits']['items']))

            page = data['page']

            total = json_resp['hits']['total']['value']
            count_of_pages = (int(total / items_in_page) + 1) if total % items_in_page else total / items_in_page
            print(f"Downloaded data from page {page} of {count_of_pages}")

            if page < count_of_pages:
                time.sleep(timeout)
                search_results += json_resp['hits']['hits'] + get_search_results({**data, 'page': page + 1}, timeout)

                for item in json_resp['hits']['hits']:
                    if not item['name']:
                        continue
                    nioktr_result = await db.execute(
                        select(Nioktr).filter(Nioktr.name.ilike(item['name'])))
                    nioktr = nioktr_result.scalars().first()
                    if nioktr is not None:
                        continue

                    print(item['_source'])
                    print("-------------------")
                    print(item['_source']['keyword_list'])
                    print("-------------------")
                    # print(item['keyword_list'])
                # print(json_resp)
                # works = []
                # count = 0
                # works.extend(search_results)
                # for work in works:
                #     if work['_source']['budgets']:
                #         print(f"{work['_source']['budgets']}")

            # else:
            #     search_results += json_resp['hits']['hits']

    except BaseException as e:
        print('Retry connection', str(e))
        # search_results = get_search_results({**data, 'page': 1}, timeout)


    return search_results


print(get_search_results(data=payload))
