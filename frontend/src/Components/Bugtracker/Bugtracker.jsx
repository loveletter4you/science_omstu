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


    const handleSubmit = (e) => {
        setModal(false)
        e.preventDefault();
        const message = document.getElementById("message").value;
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();
        const name = document.getElementsByTagName("input")[0].value;
        const mail = document.getElementsByTagName("input")[1].value;

        const postToken = async () => {
            const res = await axios.post("/api/feedback", {
                token: token,
                feedback: {name: name, mail: mail, message: message}
            });
        }
        postToken();
    }

    return (<div>
            <img src={bugtracker} className={s.image} onClick={() => setModal(true)}/>
            {isModal ? <Modal visible={true} active={isModal} setActive={setModal}>
                <form onSubmit={handleSubmit} className={s.form}>
                    <div className={s.title}>Форма обратной связи</div>
                    <div className={s.line}>
                        <div>
                            <div>Имя</div>
                            <input type="text" name="name" className={s.input}/>
                        </div>
                        <div>
                            <div>Почта</div>
                            <input type="text" name="mail" className={s.input}/>
                        </div>
                    </div>
                    <div>Сообщение</div>
                    <textarea className={s.input} id="message" name="message"/>
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_SITE_KEY}
                        ref={captchaRef}
                    />
                    <div><input className={s.input} type="submit" value="Отправить"/></div>
                </form>
            </Modal> : null}
        </div>
    );
}

export default BugTracker;
