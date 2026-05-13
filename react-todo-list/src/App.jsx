import { useState } from 'react'
import NewTodoForm from './components/NewTodoForm'
import TodoList from './components/TodoList'

function App() {
    const [todos, setTodos] = useState([])

    function handleAddTodo(text) {
        setTodos(prev => [
            ...prev,
            { id: crypto.randomUUID(), text, completed: false }
        ])
    }

    function handleToggle(id) {
        setTodos(prev =>
            prev.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        )
    }

    function handleDelete(id) {
        setTodos(prev => prev.filter(todo => todo.id !== id))
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>📝 My Todo List</h1>
            <NewTodoForm onAdd={handleAddTodo} />
            <p style={styles.count}>
                {todos.filter(t => !t.completed).length} task(s) remaining
            </p>
            <TodoList
                todos={todos}
                onToggle={handleToggle}
                onDelete={handleDelete}
            />
            {todos.length === 0 && (
                <p style={styles.empty}>No tasks yet. Add one above!</p>
            )}
        </div>
    )
}

const styles = {
    container: {
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
    },
    title: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '2rem',
        color: '#e94560',
    },
    count: {
        fontSize: '0.85rem',
        color: '#aaa',
        marginBottom: '1rem',
        textAlign: 'right',
    },
    empty: {
        textAlign: 'center',
        color: '#555',
        marginTop: '2rem',
        fontStyle: 'italic',
    },
}

export default App 