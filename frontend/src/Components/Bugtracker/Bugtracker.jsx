import React, {useState, useRef} from "react";
import bugtracker from "./../../assets/img/bagtracker.png"
import s from "./Bugtracker.module.css"
import Modal from "./BugtrackerWindow";
/*import reCAPTCHA from "react-google-recaptcha";*/

const BugTracker = () => {
    const [isModal, setModal] = useState(false);
    const captchaRef = useRef(null);
   /* const token = captchaRef.current.getValue();

    const handleSubmit = (e) =>{
        e.preventDefault();
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();
    }*/

    return (<div>
            <img src={bugtracker} className={s.image} onClick={() => setModal(true)}/>
            {isModal ? <Modal visible={true} active={isModal} setActive={setModal}>
               {/* <form onSubmit={handleSubmit}>*/}
                <div>Форма обратной связи</div>
                <div>Имя</div>
                <div><input type={"text"}/></div>
                <div>Почта</div>
                <div><input type={"text"}/></div>
                <div>Сообщение</div>
                <div><textarea type={"text"} cols="40" rows="3"/></div>
                <div><input type="submit" value="Отправить"/></div>
                {/*<reCAPTCHA
                    sitekey={process.env.REACT_APP_SITE_KEY}
                    ref={captchaRef}
                />*/}
               {/* </form>*/}
            </Modal> : null}
        </div>
    );
}

export default BugTracker;
