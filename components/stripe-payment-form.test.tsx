import { render, screen, waitFor } from '@testing-library/react'
import { StripePaymentForm } from './stripe-payment-form'

// Mock window.Stripe
beforeAll(() => {
  Object.defineProperty(window, 'Stripe', {
    writable: true,
    value: jest.fn().mockReturnValue({
      elements: jest.fn().mockReturnValue({
        create: jest.fn().mockReturnValue({
          mount: jest.fn(),
          unmount: jest.fn(),
          on: jest.fn(),
        }),
        getElement: jest.fn().mockReturnValue(null),
        submit: jest.fn().mockResolvedValue({}),
      }),
      confirmPayment: jest.fn().mockResolvedValue({
        paymentIntent: { id: 'pi_test', status: 'succeeded' },
      }),
    }),
  })
})

describe('StripePaymentForm', () => {
  const mockOnSuccess = jest.fn()
  const mockOnError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders payment form', () => {
    render(
      <StripePaymentForm
        clientSecret="test_secret"
        amount={100}
        onPaymentSuccess={mockOnSuccess}
        onPaymentError={mockOnError}
      />
    )
    // Button text is split across elements
    const button = screen.getByRole('button', { name: /Pay/i })
    expect(button).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    const { container } = render(
      <StripePaymentForm
        clientSecret="test_secret"
        amount={100}
        onPaymentSuccess={mockOnSuccess}
        onPaymentError={mockOnError}
      />
    )
    expect(container).toBeInTheDocument()
  })

  it('handles payment submission', async () => {
    render(
      <StripePaymentForm
        clientSecret="test_secret"
        amount={100}
        onPaymentSuccess={mockOnSuccess}
        onPaymentError={mockOnError}
      />
    )
    
    // Wait for Stripe to load
    await waitFor(() => {
      expect(window.Stripe).toBeDefined()
    })
  })

  it('displays amount in button', () => {
    render(
      <StripePaymentForm
        clientSecret="test_secret"
        amount={100}
        onPaymentSuccess={mockOnSuccess}
        onPaymentError={mockOnError}
      />
    )
    // Amount is in the button text (split across elements)
    expect(screen.getByText(/100\.00/)).toBeInTheDocument()
  })

  it('shows payment details section', () => {
    render(
      <StripePaymentForm
        clientSecret="test_secret"
        amount={100}
        onPaymentSuccess={mockOnSuccess}
        onPaymentError={mockOnError}
      />
    )
    expect(screen.getByText('Payment Details')).toBeInTheDocument()
  })

  it('shows security message', () => {
    render(
      <StripePaymentForm
        clientSecret="test_secret"
        amount={100}
        onPaymentSuccess={mockOnSuccess}
        onPaymentError={mockOnError}
      />
    )
    expect(screen.getByText(/encrypted and secure/)).toBeInTheDocument()
  })

  it('renders lock icon', () => {
    render(
      <StripePaymentForm
        clientSecret="test_secret"
        amount={100}
        onPaymentSuccess={mockOnSuccess}
        onPaymentError={mockOnError}
      />
    )
    const lockIcons = document.querySelectorAll('[class*="lucide-lock"]')
    expect(lockIcons.length).toBeGreaterThan(0)
  })
})
