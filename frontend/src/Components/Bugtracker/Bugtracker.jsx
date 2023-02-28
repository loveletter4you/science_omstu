import React, {useState, useRef} from "react";
import bugtracker from "./../../assets/img/bagtracker.png"
import s from "./Bugtracker.module.css"
import Modal from "./BugtrackerWindow";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setCaptcha} from "../../store/slices/ReCaptchaSlice";

const BugTracker = () => {
    const [isModal, setModal] = useState(false);
    const captchaRef = useRef(null);
    const captcha = useSelector(state => state.captcha)
    const dispatch = useDispatch();


    const handleSubmit = (e) =>{
        e.preventDefault();
        const token = captchaRef.current.getValue();
        dispatch(setCaptcha(token));
        captchaRef.current.reset();
        console.log(token)
        /*const postToken = async() =>{
            const res = await axios.post("/api/feedback" )
        }
        postToken();*/
    }


debugger
    return (<div>
            <img src={bugtracker} className={s.image} onClick={() => setModal(true)}/>
            {isModal ? <Modal visible={true} active={isModal} setActive={setModal}>
               <form onSubmit={handleSubmit}>
                <div>Форма обратной связи</div>
                <div>Имя</div>
                <div><input type={"text"} /></div>
                <div>Почта</div>
                <div><input type={"text"} /></div>
                <div>Сообщение</div>
                <div><textarea type={"text"} cols="40" rows="3" /></div>
                <ReCAPTCHA
                    sitekey={process.env.REACT_APP_SITE_KEY}
                    ref={captchaRef}
                />
                   <div><input type="submit" value="Отправить"/></div>
               </form>
            </Modal> : null}
        </div>
    );
}

export default BugTracker;
