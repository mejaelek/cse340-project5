function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <li style={styles.item}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                style={styles.checkbox}
            />
            <span style={{
                ...styles.text,
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.5 : 1,
            }}>
                {todo.text}
            </span>
            <button
                style={styles.deleteButton}
                onClick={() => onDelete(todo.id)}
            >
                ✕
            </button>
        </li>
    )
}

const styles = {
    item: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: '#16213e',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        accentColor: '#e94560',
    },
    text: {
        flex: 1,
        fontSize: '1rem',
    },
    deleteButton: {
        background: 'transparent',
        border: 'none',
        color: '#e94560',
        fontSize: '1rem',
        cursor: 'pointer',
        padding: '0 4px',
    },
}

export default TodoItem 