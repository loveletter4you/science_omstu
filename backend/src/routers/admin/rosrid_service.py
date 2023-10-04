import requests
import time
import json
uid = '9944117'
start_date = '2022-01-01'
end_date = '2022-12-31'
# URL API, который осуществляет поиск по ИС
search_url = 'https://rosrid.ru/api/base/search'
# Формируем заготовку для основного тела поиска
payload = {
    "search_query": None,
    "critical_technologies": [],
    "dissertations": False,
    "full_text_available": False,
    "ikrbses": False,
    "nioktrs": False,
    "organization": [uid],
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
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
    'sec-ch-ua-platform': '"Linux"',
    'origin': 'https://rosrid.ru',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://rosrid.ru/global-search',
    'accept-language': 'ru,en-US;q=0.9,en;q=0.8,ru-RU;q=0.7'
})

# Для проверки подключаемся к странице поиска и возвращаем код ответа (должен быть 200)
home_resp = session.request('GET', 'https://rosrid.ru/global-search')
home_resp.status_code
print(home_resp)

# def get_search_results(data, timeout=1):
#     items_in_page = 10
#     search_results = []
#
#     try:
#         resp = session.request("POST", search_url, data=json.dumps(data, ensure_ascii=False).encode('utf-8'))
#
#         if resp.status_code == 200:
#             json_resp = resp.json()
#             page = data['page']
#             total = json_resp['hits']['total']['value']
#             count_of_pages = (int(total / items_in_page) + 1) if total % items_in_page else total / items_in_page
#
#             print(f"Downloaded data from page {page} of {count_of_pages}")
#
#             if page < count_of_pages:
#                 time.sleep(timeout)
#                 search_results += json_resp['hits']['hits'] + get_search_results({**data, 'page': page + 1}, timeout)
#             else:
#                 search_results += json_resp['hits']['hits']
#     except BaseException as e:
#         print('Retry connection', str(e))
#         search_results = get_search_results({**data, 'page': 1}, timeout)
#
#     return search_results
#
# print(get_search_results(data=payload))




# import requests
# import time
# import json
# from sqlalchemy import select, and_
# from sqlalchemy.ext.asyncio import AsyncSession as Session
#
# from src.model.model import Identifier, PriorityDirections, OrganizationIdentifier, Organization
# from src.utils.aiohttp import SingletonAiohttp
# from src.model.storage import get_or_create_organization_omstu, get_or_create_budget_type, get_or_create_types_n, get_nioktr_by_name, create_nioktr
#
# uid = []
# uid.append('9569096') #ОмГТУ
# start_date = '2022-11-30'
# end_date = '2023-12-31'
# # URL API, который осуществляет поиск по ИС
# search_url = 'https://rosrid.ru/api/base/search'
# # Формируем заготовку для основного тела поиска
# payload = {
#     "search_query": None,
#     "critical_technologies": [],
#     "dissertations": False,
#     "full_text_available": False,
#     "ikrbses": False,
#     "nioktrs": True,
#     "organization": uid,
#     "page": 1,
#     "priority_directions": [],
#     "rids": False,
#     "rubrics": [],
#     "search_area": "Во всех полях",
#     "sort_by": "Дата регистрации",
#     "open_license": False,
#     "free_licenses": False,
#     "expert_estimation_exist": False,
#     "start_date": start_date,
#     "end_date": end_date
# }
#
# # Создаём сессию и проставляем стандартные заголовки, что бы не сильно отличаться от браузера
# session = requests.session()
# session.headers.update({
#     'authority': 'rosrid.ru',
#     'pragma': 'no-cache',
#     'cache-control': 'no-cache',
#     'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
#     'accept': 'application/json, text/plain, */*',
#     'sec-ch-ua-mobile': '?0',
#     'content-type': 'application/json;charset=UTF-8',
#     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
#     'sec-ch-ua-platform': '"Linux"',
#     'origin': 'https://rosrid.ru',
#     'sec-fetch-site': 'same-origin',
#     'sec-fetch-mode': 'cors',
#     'sec-fetch-dest': 'empty',
#     'referer': 'https://rosrid.ru/global-search',
#     'accept-language': 'ru,en-US;q=0.9,en;q=0.8,ru-RU;q=0.7'
# })
#
#
# def get_search_results(data, timeout=2):
#     items_in_page = 10
#     search_results = []
#
#     try:
#         resp = session.request("POST", search_url, data=json.dumps(data, ensure_ascii=False).encode('utf-8'))
#
#         if resp.status_code == 200:
#             json_resp = resp.json()
#             page = data['page']
#             total = json_resp['hits']['total']['value']
#             count_of_pages = (int(total / items_in_page) + 1) if total % items_in_page else total / items_in_page
#             print(f"Downloaded data from page {page} of {count_of_pages}")
#
#             if page < count_of_pages:
#                 time.sleep(timeout)
#                 search_results += json_resp['hits']['hits'] + get_search_results({**data, 'page': page + 1}, timeout)
#                 # works = []
#                 # count = 0
#                 # works.extend(search_results)
#                 # for work in works:
#                 #     if work['_source']['budgets']:
#                 #         print(f"{work['_source']['budgets']}")
#             else:
#                 search_results += json_resp['hits']['hits']
#
#     except BaseException as e:
#         print('Retry connection', str(e))
#         search_results = get_search_results({**data, 'page': 1}, timeout)
#
#     return search_results
#
#
# print(get_search_results(data=payload))
#
# # def get_search_results(payload, timeout=0):
# #     items_in_page = 10
# #     search_results = []
# #
# #     try:
# #         resp = session.request("POST", search_url, data=json.dumps(payload, ensure_ascii=False).encode('utf-8'))
# #         if resp.status_code == 200:
# #             json_resp = resp.json()
# #             page = payload['page']
# #             total = json_resp['hits']['total']['value']
# #             count_of_pages = (int(total / items_in_page) + 1) if total % items_in_page else total / items_in_page
# #             print(f"Downloaded data from page {page} of {count_of_pages}")
# #             time.sleep(timeout)
# #             search_results += json_resp['hits']['hits']
# #         else:
# #             print(resp.status_code)
# #             return search_results
# #     except BaseException as e:
# #         print('Retry connection', str(e))
# #         search_results = get_search_results({**payload, 'page': 1}, timeout)
# #
# #     return search_results, count_of_pages, page
# #
# #
# # def get_search_result_cicle(payload, timeout=0):
# #   search_results, count_of_pages, page = get_search_results(payload, timeout)
# #   while page < count_of_pages:
# #     page += 1
# #
# #     search_result_local, count_of_pages, page = get_search_results({**payload, 'page': page}, timeout)
# #     search_results += search_result_local
# #     return search_results
# #     # nioktrs = pd.json_normalize(search_results)
# #     # json_string = json.dumps(search_results)
# #     #
# #     # search = []
# #     #   for search_results in search:
# #     #     pass
# #
# #
# #
# #
# # # print(get_search_results(payload))
# # print(get_search_result_cicle(payload))
#
#
# # async def service_update_from_rosrid(db: Session):
# #     identifier_nioktr_result = await db.execute(select(Identifier).filter(Identifier.name == "Nioktr"))
# #     identifier_nioktr = identifier_nioktr_result.scalars().first()
# #     organization_omstu = await get_or_create_organization_omstu(db)
# #     budget_type = await get_or_create_budget_type("test", db)
# #     types_n = await get_or_create_types_n("test", db)
# #     nioktrs = pd.json_normalize(get_search_result_cicle({**payload, 'nioktrs': True}))
# #
# #     for _, row in nioktrs.iterrows():
# #         name: str
# #         if row['_source.work_supervisor.name']:
# #             name = f'{row["_source.work_supervisor.surname"]} {row["_source.work_supervisor.name"]} {row["_source.work_supervisor.patronymic"]}'
# #         else:
# #             name = row['_source.work_supervisor.surname']
# #         nioktr = await get_nioktr_by_name(row["_source.name"], db)
# #         # source = await get_source_by_name_or_identifiers(str(row['title_main']), issns, db)
# #         if nioktr is None:
# #             nioktr = await create_nioktr(name, row["_source.executor.name"], row["_id"], row["_source.name"],
# #                                          row["_source.annotation"], row["_source.last_status.created_date"],
# #                                          row["_source.contract_date"],
# #                                          row["_source.start_date"],
# #                                          row["_source.end_date"], row["_source.contract_number"], db)
#
#
#
#     # Убрать пандас!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#
#
#
#
#
#
#
#     # if identifier_nioktr is None:
#     #     return None
#     # nioktr_result = await db.execute(select(OrganizationIdentifier).join(Organization)
#     #                                  .filter(OrganizationIdentifier.identifier == identifier_nioktr))
#     # nioktr = nioktr_result.scalars().all()
#
#
# # for i, row in nioktrs.iterrows():
# #   if row['_source.work_supervisor.name'] and str(row['_source.work_supervisor.name']) != 'nan' and str(row['_source.work_supervisor.patronymic']) != 'nan':
# #     author_name = f"{row['_source.work_supervisor.surname']} {row['_source.work_supervisor.name'][0]}.{row['_source.work_supervisor.patronymic'][0]}."
# #   else:
# #     author_name = row['_source.work_supervisor.surname']
# #   if not (row['_source.executor.organization_id'] in institutions.keys()):
# #     institutions[row['_source.executor.organization_id']] = row['_source.executor.short_name']
# #   elif not institutions[row['_source.executor.organization_id']] and not row['_source.executor.short_name']:
# #     institutions[row['_source.executor.organization_id']] = row['_source.executor.short_name']
# #   for rs in ast.literal_eval(row['_source.rubrics']):
# #     if rs['code'] in nioktr.keys():
# #       nioktr[rs['code']] += 1
# #       if author_name in nioktr_names[rs['code']].keys():
# #         nioktr_names[rs['code']][author_name] += 1
# #       else:
# #         nioktr_names[rs['code']][author_name] = 1
# #       if row['_source.executor.organization_id'] in nioktr_institutions[rs['code']].keys():
# #         nioktr_institutions[rs['code']][row['_source.executor.organization_id']] += 1
# #       else:
# #         nioktr_institutions[rs['code']][row['_source.executor.organization_id']] = 1
# #     else:
# #       rid[rs['code']] = 0
# #       nioktr[rs['code']] = 1
# #       dissertation[rs['code']] = 0
# #       rid_name[rs['code']] = rs['name']
# #       rid_names[rs['code']] = {}
# #       nioktr_names[rs['code']] = {author_name: 1}
# #       dissertation_names[rs['code']] = {}
# #       #rid_institutions[rs['code']] = {}
# #       nioktr_institutions[rs['code']] = {row['_source.executor.organization_id']: 1}
# #       dissertation_institutions[rs['code']] = {}
# #   for oecd in ast.literal_eval(row['_source.oecds']):
# #     if oecd['code'] in oecd_nioktr.keys():
# #       oecd_nioktr[oecd['code']] += 1
# #       if author_name in oecd_nioktr_names[oecd['code']].keys():
# #         oecd_nioktr_names[oecd['code']][author_name] += 1
# #       else:
# #         oecd_nioktr_names[oecd['code']][author_name] = 1
# #       if row['_source.executor.organization_id'] in oecd_nioktr_institutions[oecd['code']].keys():
# #         oecd_nioktr_institutions[oecd['code']][row['_source.executor.organization_id']] += 1
# #       else:
# #         oecd_nioktr_institutions[oecd['code']][row['_source.executor.organization_id']] = 1
# #     else:
# #       oecd_rid[oecd['code']] = 0
# #       oecd_nioktr[oecd['code']] = 1
# #       oecd_dissertation[oecd['code']] = 0
# #       oecd_name[oecd['code']] = oecd['name']
# #       oecd_rid_names[oecd['code']] = {}
# #       oecd_nioktr_names[oecd['code']] = {author_name: 1}
# #       oecd_dissertation_names[oecd['code']] = {}
# #       oecd_rid_institutions[oecd['code']] = {}
# #       oecd_nioktr_institutions[oecd['code']] = {row['_source.executor.organization_id']: 1}
# #       oecd_dissertation_institutions[oecd['code']] = {}