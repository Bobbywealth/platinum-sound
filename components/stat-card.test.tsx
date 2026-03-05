import { render, screen } from '@testing-library/react'
import { StatCard } from './stat-card'
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react'

describe('StatCard', () => {
  it('renders title correctly', () => {
    render(<StatCard title="Total Revenue" value="$1,000" icon={DollarSign} />)
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
  })

  it('renders value correctly', () => {
    render(<StatCard title="Total Revenue" value="$1,000" icon={DollarSign} />)
    expect(screen.getByText('$1,000')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(<StatCard title="Total Revenue" value="$1,000" icon={DollarSign} />)
    // Icon is rendered as SVG
    const icons = document.querySelectorAll('[class*="lucide-dollar-sign"]')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('displays positive change', () => {
    render(<StatCard title="Total Revenue" value="$1,000" icon={DollarSign} change={15} />)
    expect(screen.getByText(/\+15%/)).toBeInTheDocument()
  })

  it('displays negative change', () => {
    render(<StatCard title="Total Revenue" value="$1,000" icon={DollarSign} change={-10} />)
    expect(screen.getByText(/-10%/)).toBeInTheDocument()
  })

  it('displays description when provided', () => {
    render(
      <StatCard
        title="Pending Invoices"
        value="5"
        icon={TrendingUp}
        description="$500 pending"
      />
    )
    expect(screen.getByText('$500 pending')).toBeInTheDocument()
  })

  it('renders with different icons', () => {
    const { rerender } = render(
      <StatCard title="Clients" value="10" icon={Users} />
    )
    expect(screen.getByText('Clients')).toBeInTheDocument()

    rerender(<StatCard title="Bookings" value="20" icon={Calendar} />)
    expect(screen.getByText('Bookings')).toBeInTheDocument()
  })

  it('handles zero change', () => {
    render(<StatCard title="Total Revenue" value="$1,000" icon={DollarSign} change={0} />)
    // Zero change shows as +0%
    expect(screen.getByText(/\+0%/)).toBeInTheDocument()
  })

  it('handles string value', () => {
    render(<StatCard title="Active Clients" value="25" icon={Users} />)
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('handles formatted currency value', () => {
    render(<StatCard title="Total Revenue" value="$12,500.00" icon={DollarSign} />)
    expect(screen.getByText('$12,500.00')).toBeInTheDocument()
  })
})
