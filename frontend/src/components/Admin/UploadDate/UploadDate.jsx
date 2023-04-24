import React from "react";
import {useForm} from "react-hook-form";
import {DataUploadAPI} from "../../../store/api";
import Admin from "../Admin";
import s from "./Upload.module.css"
import {useCookies} from "react-cookie";
import Error404 from "../../Helpers/Errors/Erorr404";

const UploadDate = () => {
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            authorsUpload: FileList,
            WhiteListUpload: FileList,
            ScopusUpload: FileList,
            JCRUpload: FileList
        }
    });
    const [cookies, ] = useCookies(['isAuth'])
    const onSubmitAuthors = (data) => {

        let formData = new FormData();
        formData.append("file", data.authorsUpload[0], data.authorsUpload[0].filename)
        const UploadAuthors = async () => {
            console.log(data.authorsUpload[0])
            try {
                const res = await DataUploadAPI.postAuthorsData(formData);
            } catch (e) {
                console.log(e)
            }
        }
        UploadAuthors();
    }
    const onSubmitWhiteList = (data) => {
        let formData = new FormData();
        formData.append("file", data.authorsUpload[1], data.authorsUpload[1].filename)
        const UploadAuthors = async () => {
            try {
                const res = await DataUploadAPI.postWhiteListData(formData);

            } catch (e) {

            }
        }
        UploadAuthors();
    }

    const onSubmitScopus = (data) => {
        let formData = new FormData();
        formData.append("file", data.authorsUpload[2], data.authorsUpload[2].filename)
        const UploadAuthors = async () => {
            try {
                const res = await DataUploadAPI.postScopusData(formData);

            } catch (e) {

            }
        }
        UploadAuthors();
    }
    const onSubmitJCR = (data) => {
        let formData = new FormData();
        formData.append("file", data.authorsUpload[3], data.authorsUpload[3].filename)
        const UploadAuthors = async () => {
            try {
                const res = await DataUploadAPI.postJCRData(formData);

            } catch (e) {

            }
        }
        UploadAuthors();
    }

    return <div>
        {cookies.isAuth ? <div>
            <Admin/>
            <div className={s.container}>
                <form onSubmit={handleSubmit(onSubmitAuthors)}>
                    Авторы:
                    <div>
                        <input  {...register("authorsUpload")} className={s.submit} accept="text/csv" type="file"/>
                    </div>
                    <div>
                        <input className={s.submit} type="submit"/>
                    </div>
                </form>
                <form onSubmit={handleSubmit(onSubmitWhiteList)}>
                    Публикации (Белый лист):
                    <div>
                        <input className={s.submit}  {...register("WhiteListUpload")} accept="text/csv" type="file"/>
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
        </div> : <Error404/>}
    </div>
}

export default UploadDate;
