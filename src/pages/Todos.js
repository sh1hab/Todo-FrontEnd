import axios from "axios";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import {useCookies} from "react-cookie";
import TodoCard from "../components/TodoCard";

const Todos = () => {
    // To activate loading loading status will be true
    // eslint-disable-next-line no-unused-vars
    const [todos, setTodos] = useState([]);
    const [title, setTitleName] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(["uuid"]);

    const handleChange = (event) => {
        setTitleName(event.target.value);
    }

    // useEffect(() => {
    //     setLoading(true);
    //     axios.get(process.env.REACT_APP_API_URL + '/todos',{
    //         withCredentials: true,
    //     }).then(res => {
    //         // console.log(res.data);
    //         const responseTodos = res.data;
    //         setTodos(responseTodos);
    //         setLoading(false);
    //     });
    // }, []);

    const addTodo = () => {
        // if (taskName === "") return;
        if (title === "") return;

        const todo = {
            id: Math.floor(Math.random() * 10000),
            uuid: cookies["uuid"],
            title: title,
        };

        setTitleName("");

        const allTodos = [
            ...todos,
            todo
        ];

        setTodos(allTodos);
    };

    const updateTodo = task => {
        const setTodos = todos.map(t => (t.id === task.id) ? task : t);

        setTodos(setTodos);
    }

    const removedTodo = task => {
        const setTodos = todos.filter(t => t.id !== task.id);

        setTodos(setTodos);
    }

    const saveTodos = () => {
        setLoading(true);
        // console.log(todos);

        saveTodosInDb(todos)
            .then(() => {
                setLoading(false);
            });
    }

    const loadTodos = () => {
        setLoading(true);

        loadTodosFromDb()
            .then(tasks => {
                setTodos(tasks);

                setLoading(false);
            });
    }

    const clearTodos = () => {
        setLoading(true);

        clearTodosFromDb()
            .then(tasks => {
                setTodos(tasks);

                setLoading(false);
            });
    }

    return (
        <div className="page-wrapper">
            {/* Task input area start from here */}
            <div className="task-input-area d-flex align-itmes-center pb-3 pb-md-5">
                <input
                    type="text"
                    name="task"
                    id="task"
                    placeholder="Task Name"
                    className="form-control me-2 me-md-3"
                    onChange={handleChange}
                />
                <button type="submit" onClick={addTodo}>
                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.000976562 13.714V8.38H8.38098V0H13.754V8.38H22.137V13.714H13.754V22.136H8.37799V13.714H0.000976562Z"
                            fill="#1178E2"
                        />
                    </svg>
                </button>
            </div>

            <>
                {
                    todos.map((todo) => (
                        <TodoCard key={todo.id}
                            todo={todo}
                            onRemoveTodo={removedTodo}
                            onUpdateTodo={updateTodo} />
                    ))
                }
            </>

            {/* Task show area start from here */}
            <div className="task-show-area">
                <div className="check-area">
                    <input type="checkbox" className="custom-checkbox" name="checkTask" id="checkTask" />
                </div>
                <div className="title-area"> Task number one</div>
                <div className="delete-area">
                    <button type="reset">
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

            {/* Task action area end from here */}
            <div className="task-action-btn">
                <button onClick={saveTodos}>Save</button>
                <button onClick={loadTodos}>Load</button>
                <button onClick={clearTodos}>Clear</button>
            </div>
        </div>
    );
};

async function saveTodosInDb(todoItems) {
    let todos = [];
    console.log(todoItems);

    await fetch(process.env.REACT_APP_API_URL + '/todos/save', {
        method: "PUT",
        credentials: 'include',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify({
            "todos": todoItems
        })
    })
        .then(res => {
            if (res.status !== 200) {
                throw Error('Some error occurred')
            }

            return res.json();
        })
        .then(response => {
            todos = response.todos;
        })
        .catch(err => {
            console.log('Error', err);
        });

    return todos;
}

async function loadTodosFromDb() {
    let todos = [];

    await fetch(process.env.REACT_APP_API_URL + '/todos', {
        credentials: 'include'
    })
        .then(res => {
            if (res.status !== 200) {
                throw Error('Some error occurred')
            }

            return res.json();
        })
        .then(response => {
            todos = response.todos.map(t => {
                t['is_new'] = false

                return t;
            });
        })
        .catch(err => {
            console.log('Error', err);
        });

    return todos;
}

async function clearTodosFromDb() {
    await fetch(process.env.REACT_APP_API_URL + '/todos/clear', {
        credentials: 'include'
    })
        .then(res => {
            if (res.status !== 200) {
                throw Error('Some error occurred')
            }

            return res.json();
        })
        .catch(err => {
            console.log('Error', err);
        });

    return [];
}

export default Todos;
