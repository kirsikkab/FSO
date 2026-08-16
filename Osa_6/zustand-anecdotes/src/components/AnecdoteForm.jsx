import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const generateId = () =>
    Number((Math.random() * 1000000).toFixed(0))

  const addAnecdote = event => {
    event.preventDefault()

    const content = event.target.anecdote.value

    add({
      id: generateId(),
      content,
      votes: 0
    })

    event.target.reset()
  }

  return (
    <form onSubmit={addAnecdote}>
      <div>
        <input name="anecdote" />
      </div>

      <button type="submit">
        create
      </button>
    </form>
  )
}

export default AnecdoteForm