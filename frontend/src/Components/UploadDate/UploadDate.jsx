import React from "react";
import {useForm} from "react-hook-form";
import {DataUploadAPI, postSignIn} from "../api";
import {setError} from "../../store/slices/SignInSlice";
const UploadDate = () => {
    const {register, formState: {errors}, handleSubmit} = useForm();

    const onSubmit = (data) => {
        const UploadAuthors = async () => {
            try {
                const res = await DataUploadAPI.postAuthorsData(data);

            } catch (e) {
                dispatch(setError(e.response.status));
            }

        }
        UploadAuthors();
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
        <input accept = "file/csv" type="file"/>
        </form>
    </div>
}

export default UploadDate;
