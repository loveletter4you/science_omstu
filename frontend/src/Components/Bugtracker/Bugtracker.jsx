import React, {useState, useRef} from "react";
import bugtracker from "./../../assets/img/bagtracker.png"
import s from "./Bugtracker.module.css"
import Modal from "./BugtrackerWindow";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import {useDispatch} from "react-redux";

const BugTracker = () => {
    const [isModal, setModal] = useState(false);
    const captchaRef = useRef(null);
    const dispatch = useDispatch();


    const handleSubmit = (e) =>{
        e.preventDefault();
        const message = document.getElementById("message").value;
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();
        const name = document.getElementsByTagName("input")[0].value;
        const mail = document.getElementsByTagName("input")[1].value;
        
        const postToken = async() =>{
            const res = await axios.post("/api/feedback", {token: token, feedback:{name: name, mail: mail, message: message}} );
        }
        debugger
        postToken();
    }



    return (<div>
            <img src={bugtracker} className={s.image} onClick={() => setModal(true)}/>
            {isModal ? <Modal visible={true} active={isModal} setActive={setModal}>
               <form onSubmit={handleSubmit}>
                <div>Форма обратной связи</div>
                <div>Имя</div>
                <div><input type="text" name ="name" /></div>
                <div>Почта</div>
                <div><input type="text" name = "mail" /></div>
                <div>Сообщение</div>
                <div><textarea id = "message" name="message" cols="40" rows="3" /></div>
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
