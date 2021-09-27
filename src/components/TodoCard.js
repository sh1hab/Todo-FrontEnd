import React from "react";
// import { useHistory } from "react-router-dom";

const TodoCard = ({ todo, removeTodo, updateTodo }) => {
    // const { todo } = props;
    const { id, completed, title } = todo;
    // let history = useHistory();

    return (
        <div className="task-show-area">
            <div className="check-area">
                <input type="checkbox" className="custom-checkbox" name="checkTodo" id="checkTodo" onClick={updateTodo} />
            </div>
            <div className="title-area">
                {title}
            </div>
            <div className="delete-area">
                <button type="reset" onClick={removeTodo}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            opacity="0.5"
                            d="M0.37257 4.11132L4.14427 0.339621L10.0698 6.26518L15.9954 0.339621L19.7947 4.13894L13.8691 10.0645L19.7968 15.9922L16.0251 19.7639L10.0974 13.8362L4.14219 19.7914L0.340762 15.99L6.29601 10.0348L0.37257 4.11132Z"
                            fill="#666E76"
                        />
                    </svg>
                </button>
            </div>
        </div>

    );
};

export default TodoCard;
