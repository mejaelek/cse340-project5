import TodoItem from './TodoItem'

function TodoList({ todos, onToggle, onDelete }) {
    return (
        <ul style={styles.list}>
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    )
}

const styles = {
    list: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
}

export default TodoList