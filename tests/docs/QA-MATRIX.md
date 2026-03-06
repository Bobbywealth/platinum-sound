# Page-by-Page QA Matrix

## Public Pages

### 1. Home Page (`/`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Page loads without crash | Full page renders | E2E |
| Hero section displays | Video/gradient background visible | E2E |
| Navigation works | All nav links functional | E2E |
| CTA buttons work | Book Now links to /booking | E2E |
| Mobile responsive | Layout adapts at breakpoints | E2E |
| Dark mode support | Theme toggle works | Manual |
| SEO meta tags | Proper title and description | Manual |

### 2. Booking Page (`/booking`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Multi-step form loads | All 9 steps visible in progress | E2E |
| Step 1 - Client info validation | Required fields enforced | E2E |
| Step 2 - Session type selection | Online/In-Person toggle works | E2E |
| Step 3 - Studio selection | Studios load from API | E2E |
| Step 4 - Date picker | Calendar displays correctly | E2E |
| Step 5 - Session details | Form validates input | E2E |
| Step 6 - Time slots | Consecutive slots required | E2E |
| Step 7 - Add-ons | Mic selection loads | E2E |
| Step 8 - Authorization | Signature capture works | E2E |
| Step 9 - Review & pay | Pricing calculates correctly | E2E |
| Stripe payment integration | Payment form loads | E2E |
| Form submission | Creates booking + lead | E2E |
| Error handling | API errors show toast | E2E |
| Mobile layout | Steps scroll horizontally | E2E |
| Loading states | Skeleton during fetch | E2E |

### 3. Check-In Page (`/check-in`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Booking code input | Text field accepts input | E2E |
| Valid booking code lookup | Returns booking details | API |
| Invalid code error | Shows "not found" message | E2E |
| Success state | Shows client/studio info | E2E |
| Contact info display | Phone/email visible | E2E |
| Staff login link | Links to /login | E2E |
| Mobile responsive | Full width on mobile | E2E |

### 4. Login Page (`/login`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Email validation | Shows error for invalid format | E2E |
| Password validation | Minimum 6 characters | E2E |
| Required field validation | Both fields required | E2E |
| Invalid credentials | Error message displays | E2E |
| Successful login | Redirects to dashboard | E2E |
| Remember me checkbox | Checkbox functional | E2E |
| Social login buttons | Google/GitHub buttons visible | E2E |
| Forgot password link | Link to password reset | Manual |
| Redirect if already logged in | Goes to dashboard | E2E |
| Video background loads | Hero video plays | Visual |

---

## Authenticated Dashboard Pages

### 5. Dashboard Home (`/dashboard`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Stats cards load | Revenue, clients, bookings display | E2E |
| Today's sessions | Shows today's bookings | E2E |
| Upcoming bookings | Lists next 5 bookings | E2E |
| Studio status | All 6 studios show status | E2E |
| Recent activity | Activity feed displays | E2E |
| Quick actions | New Booking button works | E2E |
| Clock updates | Time refreshes every minute | E2E |
| Loading skeleton | Shows during data fetch | E2E |
| Empty states | "No sessions" message | Manual |

### 6. Bookings List (`/dashboard/bookings`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Bookings list loads | Table displays bookings | E2E |
| Filtering by status | Filter dropdown works | E2E |
| Filtering by studio | Studio filter works | E2E |
| Date range filter | Start/end date works | E2E |
| Search functionality | Search by client name | E2E |
| Pagination | Page navigation works | E2E |
| New booking button | Links to new booking form | E2E |
| Row click | Opens booking details | E2E |
| Status badges | Color-coded status | Visual |
| Empty state | "No bookings" message | Manual |

### 7. New Booking (`/dashboard/bookings/new`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Client selection | Dropdown/search works | E2E |
| Studio selection | Room list loads | E2E |
| Engineer selection | Engineer list loads | E2E |
| Date/time picker | Calendar and time slots | E2E |
| Pricing calculation | Amounts calculate correctly | E2E |
| Discount application | Discounts apply within limits | E2E |
| Form validation | Required fields enforced | E2E |
| Submit creates booking | POST to API succeeds | E2E |
| Error handling | Shows errors on failure | E2E |

### 8. Clients List (`/dashboard/clients`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Clients table loads | All clients display | E2E |
| Search functionality | Search by name/email | E2E |
| Status filter | Filter by ACTIVE/PENDING | E2E |
| Pagination | Works correctly | E2E |
| Add client button | Opens add form | E2E |
| Client row click | Opens details/edit | E2E |
| Import clients | CSV import works | API |
| Stats display | Transaction count, spend | Visual |

### 9. Invoices (`/dashboard/invoices`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Invoice list loads | Table displays invoices | E2E |
| Create invoice button | Opens create form | E2E |
| Invoice status | PAID/PENDING/OVERDUE badges | Visual |
| Due date display | Shows correctly formatted | Visual |
| Client link | Links to client details | E2E |

### 10. Calendar (`/dashboard/calendar`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Calendar renders | Month view displays | E2E |
| Bookings shown | Sessions appear on dates | E2E |
| Studio filter | Filter by studio works | E2E |
| Navigation | Month prev/next works | E2E |
| Booking details | Click shows details popup | E2E |
| Today indicator | Current date highlighted | Visual |

### 11. Availability (`/dashboard/availability`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Engineer list loads | Shows all engineers | E2E |
| Availability calendar | Date grid displays | E2E |
| Block dates | Can mark unavailable | E2E |
| Vacation marking | Can mark vacation days | E2E |
| Save changes | Persists to database | API |

### 12. Rooms/Studios (`/dashboard/studios`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Studios list loads | All 6 studios display | E2E |
| Studio details | Name, rate, status | Visual |
| Lock room | Opens lockout dialog | E2E |
| Room rates | Base rate displayed | Visual |
| Status badges | AVAILABLE/MAINTENANCE/LOCKED | Visual |

### 13. Staff (`/dashboard/staff`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Staff list loads | All users display | E2E |
| Role display | Shows role name | Visual |
| Add staff button | Opens add form | E2E |
| Edit staff | Can modify details | API |
| Deactivate | Can disable account | API |

### 14. Reports (`/dashboard/reports`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Report types | All report types listed | E2E |
| Date range selection | Works correctly | E2E |
| Generate report | Creates report data | API |
| Export options | Download functionality | Manual |
| Charts display | Recharts renders | Visual |

### 15. Settings (`/dashboard/settings`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| General settings | Form loads | E2E |
| Save settings | Persists to database | API |
| Email settings | SMTP configuration | API |
| Stripe settings | Payment configuration | API |
| Security settings | Password change | E2E |

### 16. Tasks (`/dashboard/tasks`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Task list loads | All tasks display | E2E |
| Create task | Form works | E2E |
| Task status | TODO/IN_PROGRESS/COMPLETED | Visual |
| Assign engineer | Dropdown works | E2E |
| Due dates | Display correctly | Visual |

### 17. Work Orders (`/dashboard/work-orders`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Work order list | Table displays | E2E |
| Create work order | Form functional | E2E |
| Status workflow | OPEN → IN_PROGRESS → COMPLETED | E2E |
| Sign work order | Digital signature works | E2E |
| Assignment | Engineer assignment works | E2E |

### 18. Inventory (`/dashboard/inventory`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Inventory list | All items display | E2E |
| Categories | Filter by category | E2E |
| Add item | Form works | E2E |
| Sign-off | Equipment sign-off | E2E |
| Status badges | IN_STOCK/LOW_STOCK/OUT | Visual |

### 19. Expenses (`/dashboard/expenses`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Expense list | Table displays | E2E |
| Add expense | Form functional | E2E |
| Categories | Filter works | E2E |
| Totals | Summary calculations | Visual |

### 20. Leads (`/dashboard/leads`)
| Checkpoint | Expected Behavior | Test Type |
|------------|-------------------|------------|
| Leads list | Table displays | E2E |
| Convert to client | Converts lead to client | API |
| Lead status | Status displayed | Visual |
| Follow-up | Date tracking | Manual |

---

## Edge Cases to Test

### Authentication
- [ ] Session expiry handling
- [ ] Multiple simultaneous logins
- [ ] Logout clears all state
- [ ] Password reset flow
- [ ] Social login failures

### Data Validation
- [ ] Maximum input lengths
- [ ] Special characters in names
- [ ] Unicode support
- [ ] Empty vs null handling
- [ ] Future date validation
- [ ] Past date handling

### Error Handling
- [ ] Network offline
- [ ] API timeout
- [ ] Database errors
- [ ] Invalid JSON responses
- [ ] Rate limiting responses

### Performance
- [ ] Large data sets (1000+ records)
- [ ] Concurrent requests
- [ ] Memory leaks
- [ ] Slow network simulation
- [ ] Large file uploads

---

## Accessibility Checklist

- [ ] All images have alt text
- [ ] Form labels associated with inputs
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] Color contrast meets WCAG AA
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] ARIA attributes where needed
- [ ] Skip to main content link
- [ ] Error messages announced
- [ ] Loading states announced
- [ ] Modal focus trapping
- [ ] Screen reader testing

---

## Security Checklist

- [ ] XSS prevention
- [ ] CSRF protection
- [ ] SQL injection prevention
- [ ] Authentication on protected routes
- [ ] Authorization checks
- [ ] Sensitive data not exposed
- [ ] Secure headers configured
- [ ] Rate limiting enabled
- [ ] Input sanitization
- [ ] Error messages don't leak info

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome
