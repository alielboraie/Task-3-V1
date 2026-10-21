import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = {
  title: '',
  description: '',
  category: 'other',
  status: 'lost',
  location: ''
}

export default function ItemForm() {
  const nav = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function loadItem() {
      try {
        const response = await api.get(`/items/${id}`)
        const item = response.data

        setForm({
          title: item.title || '',
          description: item.description || '',
          category: item.category || 'other',
          status: item.status || 'lost',
          location: item.location || ''
        })
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to load this item'
        )
      }
    }

    loadItem()
  }, [id])

  function onChange(e) {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      if (id) {
        await api.patch(`/items/${id}`, form)
      } else {
        await api.post('/items', form)
      }

      nav('/items')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to save this item'
      )
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit' : 'Report'} Item
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={onChange}
            required
            className="input w-full"
            placeholder="Black backpack"
          />
        </div>

        <div>
          <label htmlFor="status" className="block mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={onChange}
            className="input w-full"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={onChange}
            className="input w-full"
          >
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="documents">Documents</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={onChange}
            className="input w-full"
            placeholder="Library 2nd floor"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
            className="input w-full"
            rows="4"
            placeholder="Add more details"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button className="btn" type="submit">
          Save
        </button>
      </form>
    </div>
  )
}