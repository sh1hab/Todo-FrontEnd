import { useState } from "react";
import { useCookies } from "react-cookie";
import TodoCard from "../components/TodoCard";
import Loading from "../components/Loading";

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitleName] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(["uuid"]);

    const handleChange = (event) => {
        setTitleName(event.target.value);
    }

    const addTodo = () => {
        setLoading(true);
        if (title === "") return;
        const todo = {
            id: Math.floor(Math.random() * 10000),
            uuid: cookies["uuid"],
            title: title,
        };

        setTitleName(" ");

        const allTodos = [
            ...todos,
            todo
        ];

        addTodoInDatabase(todo)
            .then(() => {
                setLoading(false);
            });

        setTodos(allTodos);
    };

    const removedTodo = task => {
        const allTodos = todos.filter(t => t.id !== task.id);
        setTodos(allTodos);
    }

    const updateTodo = todo => {
        const allTodos = todos.map(t => (t.id === todo.id) ? todo : t);
        setTodos(allTodos);
    }

    const loadTodos = () => {
        setLoading(true);
        loadTodosFromDatabase()
            .then(tasks => {
                setTodos(tasks);
                setLoading(false);
            });
    }

    const clearTodos = () => {
        setLoading(true);
        clearTodosFromDatabase()
            .then(tasks => {
                setTodos(tasks);
                setLoading(false);
            });
    }

    const saveTodos = () => {
        setLoading(true);
        saveTodosInDatabase(todos)
            .then(() => {
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
                    value={title}
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

            {/* Task show area start from here */}
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

            {/* Task action area end from here */}
            <div className="task-action-btn">
                <button onClick={saveTodos}>Save</button>
                <button onClick={loadTodos}>Load</button>
                <button onClick={clearTodos}>Clear</button>
            </div>

            {/* Loading Spinner */}
            {loading && <Loading />}
        </div>
    );
};

async function addTodoInDatabase(todo) {
    await fetch(process.env.REACT_APP_API_URL + '/todos', {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify({
            "title": todo.title
        })
    })
        .then(res => {
            if (res.status !== 200) {
                throw Error('Error')
            }
            return res.json();
        })
        .then(response => {
            todo = response.todo;
        })
        .catch(err => {
            console.log('Error', err);
        });

    return todo;
}

async function clearTodosFromDatabase() {
    await fetch(process.env.REACT_APP_API_URL + '/todos/clear', {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(res => {
            if (res.status !== 200) {
                throw Error('Error')
            }
            return res.json();
        })
        .catch(err => {
            console.log('Error', err);
        });

    return [];
}

async function saveTodosInDatabase(todoItems) {
    let todos = [];
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
                throw Error('Error')
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

async function loadTodosFromDatabase() {
    let todos = [];

    await fetch(process.env.REACT_APP_API_URL + '/todos', {
        credentials: 'include'
    })
        .then(res => {
            if (res.status !== 200) {
                throw Error('Error')
            }
            return res.json();
        })
        .then(response => {
            todos = response.todos.map(t => {
                t['expired'] = true;
                return t;
            });
        })
        .catch(err => {
            console.log('Error', err);
        });

    return todos;
}



export default Todos;
