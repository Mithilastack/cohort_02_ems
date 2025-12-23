'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEvent } from '@/lib/adminApi'
import { ArrowLeft, Upload } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { FormField, FormFieldError } from '@/components/ui/FormField'

const CATEGORIES = [
    'Technology',
    'Business',
    'Music',
    'Sports',
    'Fashion',
    'E Sports',
    'Education',
    'Art & Culture',
    'Food & Drink',
    'Health & Wellness',
    'Entertainment'
]

export default function CreateEvent() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: '',
        price: '',
        organizer: '',
        totalSeats: '',
        availableSeats: '',
        // Optional fields
        address: '',
        registrationStartDate: '',
        registrationEndDate: '',
        eventStartDate: '',
        eventEndDate: '',
        startTime: '',
        endTime: '',
        registrationStatus: 'open',
    })
    const [bannerFile, setBannerFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('date', formData.date)
            data.append('time', formData.time)
            data.append('venue', formData.venue)
            data.append('category', formData.category)
            data.append('price', formData.price)
            data.append('organizer', formData.organizer)
            data.append('totalSeats', formData.totalSeats)
            data.append('availableSeats', formData.availableSeats)

            // Optional fields - only append if filled
            if (formData.address) data.append('address', formData.address)
            if (formData.registrationStartDate) data.append('registrationStartDate', formData.registrationStartDate)
            if (formData.registrationEndDate) data.append('registrationEndDate', formData.registrationEndDate)
            if (formData.eventStartDate) data.append('eventStartDate', formData.eventStartDate)
            if (formData.eventEndDate) data.append('eventEndDate', formData.eventEndDate)
            if (formData.startTime) data.append('startTime', formData.startTime)
            if (formData.endTime) data.append('endTime', formData.endTime)
            if (formData.registrationStatus) data.append('registrationStatus', formData.registrationStatus)

            if (bannerFile) {
                data.append('banner', bannerFile)
            }

            await createEvent(data)
            router.push('/admin/events')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => router.back()}
                    className="bg-slate-700 hover:bg-slate-600"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
                    <p className="text-slate-400">Add a new event to the system</p>
                </div>
            </div>

            <Card variant="gradient" className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField>
                            <Label htmlFor="title" className="text-slate-200">Event Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter event title"
                                maxLength={100}
                            />
                        </FormField>

                        <FormField>
                            <Label htmlFor="category" className="text-slate-200">Category *</Label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select a category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField>
                            <Label htmlFor="date" className="text-slate-200">Event Date *</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </FormField>

                        <FormField>
                            <Label htmlFor="time" className="text-slate-200">Event Time *</Label>
                            <Input
                                id="time"
                                name="time"
                                type="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </FormField>

                        <FormField>
                            <Label htmlFor="venue" className="text-slate-200">Venue *</Label>
                            <Input
                                id="venue"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                                placeholder="Enter venue location"
                            />
                        </FormField>

                        <FormField>
                            <Label htmlFor="organizer" className="text-slate-200">Organizer *</Label>
                            <Input
                                id="organizer"
                                name="organizer"
                                value={formData.organizer}
                                onChange={handleChange}
                                required
                                placeholder="Enter organizer name"
                            />
                        </FormField>

                        <FormField>
                            <Label htmlFor="price" className="text-slate-200">Ticket Price (₹) *</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="0"
                            />
                        </FormField>

                        <FormField>
                            <Label htmlFor="totalSeats" className="text-slate-200">Total Seats *</Label>
                            <Input
                                id="totalSeats"
                                name="totalSeats"
                                type="number"
                                value={formData.totalSeats}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="100"
                            />
                        </FormField>

                        <FormField>
                            <Label htmlFor="availableSeats" className="text-slate-200">Available Seats *</Label>
                            <Input
                                id="availableSeats"
                                name="availableSeats"
                                type="number"
                                value={formData.availableSeats}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="100"
                            />
                        </FormField>
                    </div>

                    <FormField>
                        <Label htmlFor="description" className="text-slate-200">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter event description"
                        />
                    </FormField>

                    {/* Optional Fields Section */}
                    <div className="border-t border-slate-700 pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4">📋 Optional Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField>
                                <Label htmlFor="address" className="text-slate-200">Full Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Complete address with city, state, pincode"
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="registrationStatus" className="text-slate-200">Registration Status</Label>
                                <select
                                    id="registrationStatus"
                                    name="registrationStatus"
                                    value={formData.registrationStatus}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="comingsoon">Coming Soon</option>
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </FormField>

                            <FormField>
                                <Label htmlFor="startTime" className="text-slate-200">Display Start Time</Label>
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    placeholder="e.g., 09:00 AM"
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="endTime" className="text-slate-200">Display End Time</Label>
                                <Input
                                    id="endTime"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    placeholder="e.g., 06:00 PM"
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="registrationStartDate" className="text-slate-200">Registration Start Date/Time</Label>
                                <Input
                                    id="registrationStartDate"
                                    name="registrationStartDate"
                                    type="datetime-local"
                                    value={formData.registrationStartDate}
                                    onChange={handleChange}
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="registrationEndDate" className="text-slate-200">Registration End Date/Time</Label>
                                <Input
                                    id="registrationEndDate"
                                    name="registrationEndDate"
                                    type="datetime-local"
                                    value={formData.registrationEndDate}
                                    onChange={handleChange}
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="eventStartDate" className="text-slate-200">Event Start Date/Time</Label>
                                <Input
                                    id="eventStartDate"
                                    name="eventStartDate"
                                    type="datetime-local"
                                    value={formData.eventStartDate}
                                    onChange={handleChange}
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="eventEndDate" className="text-slate-200">Event End Date/Time</Label>
                                <Input
                                    id="eventEndDate"
                                    name="eventEndDate"
                                    type="datetime-local"
                                    value={formData.eventEndDate}
                                    onChange={handleChange}
                                />
                            </FormField>
                        </div>
                    </div>

                    <FormField>
                        <Label htmlFor="banner" className="text-slate-200">Event Banner</Label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg cursor-pointer transition-colors">
                                <Upload className="h-5 w-5" />
                                <span>Choose File</span>
                                <input
                                    id="banner"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </label>
                            {bannerFile && (
                                <span className="text-slate-400 text-sm">{bannerFile.name}</span>
                            )}
                        </div>
                    </FormField>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-slate-700 hover:bg-slate-600"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
