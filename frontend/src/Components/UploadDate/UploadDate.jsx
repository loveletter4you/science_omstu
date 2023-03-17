import React from "react";
import {useForm} from "react-hook-form";
import {DataUploadAPI} from "../api";
import {useDispatch} from "react-redux";
import Admin from "../Admin/Admin";
import s from "./Upload.module.css"
import {useCookies} from "react-cookie";

const UploadDate = () => {
    const { register, handleSubmit, formState:{errors} } = useForm({
        defaultValues: {
            authorsUpload: FileList,
            WhiteListUpload: FileList,
            ScopusUpload: FileList,
            JCRUpload: FileList
        }
    });
    const dispatch = useDispatch();
    const [cookies, _] = useCookies(['token'])
    const onSubmitAuthors = (data) => {

        let formData = new FormData();
        formData.append("file", data.authorsUpload[0], data.authorsUpload[0].filename)
        const UploadAuthors = async () => {
            console.log(data.authorsUpload[0])
            try {
                const res = await DataUploadAPI.postAuthorsData(formData, cookies.token);
                console.log(res)
            } catch (e) {
                console.log(e)
            }
        }
        UploadAuthors();
    }
    const onSubmitWhiteList = (data) => {
        let formData = new FormData();
        formData.append("file", data.authorsUpload[1])
        const UploadAuthors = async () => {
            try {
                const res = await DataUploadAPI.postWhiteListData(data.WhiteListUpload[0], cookies.token);

            } catch (e) {

            }
        }
        UploadAuthors();
    }

    const onSubmitScopus = (data) => {
        let formData = new FormData();
        formData.append("file", data.authorsUpload[2], "authors.csv")
        const UploadAuthors = async () => {
            try {
                const res = await DataUploadAPI.postScopusData(data.ScopusUpload[0], cookies.token);

            } catch (e) {

            }
        }
        UploadAuthors();
    }
    const onSubmitJCR = (data) => {
        let formData = new FormData();
        formData.append("file", data.authorsUpload[3], "authors.csv")
        const UploadAuthors = async () => {
            try {
                const res = await DataUploadAPI.postJCRData(data.JCRUpload[0], cookies.token);

            } catch (e) {

            }
        }
        UploadAuthors();
    }

    return <div>
        <Admin/>
        <div className={s.container}>
            <form onSubmit={handleSubmit(onSubmitAuthors)}>
                Авторы:
                <div>
                    <input  {...register("authorsUpload")} className={s.submit} accept="text/csv" type="file" />
                </div>
                <div>
                    <input className={s.submit} type="submit"/>
                </div>
            </form>
            <form onSubmit={handleSubmit(onSubmitWhiteList)}>
                Публикации (Белый лист):
                <div>
                    <input className={s.submit}  {...register("WhiteListUpload")}  accept="text/csv" type="file"/>
                </div>
                <div>
                    <input className={s.submit} type="submit"/>
                </div>
            </form>
            <form onSubmit={handleSubmit(onSubmitScopus)}>
                Публикации (Scopus):
                <div>
                    <input className={s.submit} {...register("ScopusUpload")} accept="text/csv" type="file"/>
                </div>
                <div>
                    <input className={s.submit} type="submit"/>
                </div>
            </form>
            <form onSubmit={handleSubmit(onSubmitJCR)}>
                Источники:
                <div>
                    <input className={s.submit} {...register("JCRUpload")} accept="text/csv" type="file"/>
                </div>
                <div>
                    <input className={s.submit} type="submit"/>
                </div>
            </form>
        </div>
    </div>
}

export default UploadDate;
