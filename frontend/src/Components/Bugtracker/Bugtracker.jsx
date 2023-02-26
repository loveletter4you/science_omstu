import React, {useState} from "react";
import bugtracker from "./../../assets/img/bagtracker.png"
import s from "./Bugtracker.module.css"
import Modal from "./BugtrackerWindow";

const BugTracker = () => {
    const [isModal, setModal] = useState(false);

    return (<div>
            <img src={bugtracker} className={s.image} onClick={() => setModal(true)}/>
            {isModal ? <Modal visible={true} active={isModal} setActive={setModal}>
                <div>Форма обратной связи</div>
                <div>Имя</div>
                <div><input type={"text"}/></div>
                <div>Почта</div>
                <div><input type={"text"}/></div>
                <div>Сообщение</div>
                <div><textarea type={"text"} cols="40" rows="3"/></div>
                <div><input type="submit" value="Отправить"/></div>
            </Modal> : null}
        </div>
    );
}

export default BugTracker;
