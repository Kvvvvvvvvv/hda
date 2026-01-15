import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders HealVision Hub title', () => {
  render(<App />)
  const titleElement = screen.getByText(/HealVision Hub/i)
  expect(titleElement).toBeInTheDocument()
})