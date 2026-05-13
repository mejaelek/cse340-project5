import { useState } from 'react'

function NewTodoForm({ onAdd }) {
    const [inputValue, setInputValue] = useState('')

    function handleSubmit() {
        if (inputValue.trim() === '') return
        onAdd(inputValue.trim())
        setInputValue('')
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSubmit()
    }

    return (
        <div style={styles.row}>
            <input
                style={styles.input}
                type="text"
                placeholder="Add a new task..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button style={styles.button} onClick={handleSubmit}>
                Add
            </button>
        </div>
    )
}

const styles = {
    row: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '0.75rem',
    },
    input: {
        flex: 1,
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: 'none',
        fontSize: '1rem',
        background: '#16213e',
        color: '#eee',
    },
    button: {
        padding: '0.75rem 1.25rem',
        borderRadius: '8px',
        border: 'none',
        background: '#e94560',
        color: 'white',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
}

export default NewTodoForm 