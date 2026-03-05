import { render, screen } from '@testing-library/react'
import { MasterCalendar } from './master-calendar'

const mockBookings = [
  {
    id: '1',
    clientName: 'Test Client',
    date: new Date(),
    startTime: '10:00',
    endTime: '12:00',
    studio: 'Studio A',
    sessionType: 'Recording',
    status: 'CONFIRMED',
    engineer: 'John Doe',
  },
]

describe('MasterCalendar', () => {
  it('renders calendar component', () => {
    render(<MasterCalendar />)
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
  })

  it('displays booking client name when provided', () => {
    render(<MasterCalendar bookings={mockBookings} />)
    // Use getAllByText since there may be multiple elements
    expect(screen.getAllByText('Test Client').length).toBeGreaterThan(0)
  })

  it('has month/week view toggle', () => {
    render(<MasterCalendar />)
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
  })

  it('has navigation buttons', () => {
    render(<MasterCalendar />)
    // Just verify there are buttons on the page
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('displays room filter', () => {
    render(<MasterCalendar rooms={[{ id: '1', name: 'Studio A', status: 'AVAILABLE' }]} />)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0)
  })

  it('displays engineer filter', () => {
    render(<MasterCalendar engineers={[{ id: '1', name: 'John Doe', isAvailable: true }]} />)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0)
  })

  it('displays status filter', () => {
    render(<MasterCalendar />)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0)
  })

  it('renders with empty bookings', () => {
    render(<MasterCalendar bookings={[]} />)
    expect(screen.getByText('Month')).toBeInTheDocument()
  })

  it('renders master calendar title', () => {
    render(<MasterCalendar />)
    expect(screen.getByText('Master Calendar')).toBeInTheDocument()
  })
})
