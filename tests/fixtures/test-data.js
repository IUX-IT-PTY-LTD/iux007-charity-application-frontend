// Test data fixtures for charity application tests

/**
 * Mock data for testing various scenarios
 */
const testData = {
  // User test data
  users: {
    donor: {
      email: 'donor@test.com',
      password: 'Test123!',
      firstName: 'John',
      lastName: 'Donor',
      phone: '+1234567890'
    },
    admin: {
      email: 'admin@test.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    },
    charity: {
      email: 'charity@test.com',
      password: 'Charity123!',
      organizationName: 'Test Charity Organization',
      registrationNumber: 'TC123456'
    }
  },

  // Event test data
  events: {
    active: {
      id: 'event-123',
      title: 'Help Feed the Homeless',
      description: 'A campaign to provide meals for homeless individuals in our community.',
      targetAmount: 10000,
      currentAmount: 3500,
      endDate: '2024-12-31',
      category: 'hunger-relief',
      status: 'active',
      images: [
        'https://example.com/event-image-1.jpg',
        'https://example.com/event-image-2.jpg'
      ]
    },
    expired: {
      id: 'event-456',
      title: 'Education for All',
      description: 'Supporting underprivileged children with educational resources.',
      targetAmount: 5000,
      currentAmount: 5000,
      endDate: '2023-12-31',
      category: 'education',
      status: 'completed'
    },
    upcoming: {
      id: 'event-789',
      title: 'Clean Water Initiative',
      description: 'Bringing clean water access to rural communities.',
      targetAmount: 25000,
      currentAmount: 0,
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      category: 'water-sanitation',
      status: 'upcoming'
    }
  },

  // Donation test data
  donations: {
    oneTime: {
      amount: 25,
      frequency: 'one-time',
      currency: 'USD',
      anonymous: false
    },
    monthly: {
      amount: 50,
      frequency: 'monthly',
      currency: 'USD',
      anonymous: false
    },
    anonymous: {
      amount: 100,
      frequency: 'one-time',
      currency: 'USD',
      anonymous: true
    }
  },

  // Payment test data
  payments: {
    validCard: {
      cardNumber: '4242424242424242',
      expiry: '12/25',
      cvc: '123',
      postalCode: '12345',
      country: 'US'
    },
    declinedCard: {
      cardNumber: '4000000000000002',
      expiry: '12/25',
      cvc: '123',
      postalCode: '12345',
      country: 'US'
    },
    invalidCard: {
      cardNumber: '1111111111111111',
      expiry: '12/20',
      cvc: '123',
      postalCode: '12345',
      country: 'US'
    }
  },

  // Charity request test data
  charityRequests: {
    valid: {
      organizationName: 'New Hope Foundation',
      registrationNumber: 'NHF789012',
      description: 'A foundation dedicated to helping homeless veterans.',
      contactEmail: 'contact@newhope.org',
      contactPhone: '+1987654321',
      website: 'https://newhope.org',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      documents: [
        'registration-certificate.pdf',
        'tax-exemption-letter.pdf'
      ]
    }
  },

  // Blog test data
  blogs: {
    published: {
      id: 'blog-123',
      title: 'The Impact of Your Donations',
      content: 'Learn how your generous donations are making a real difference...',
      excerpt: 'Discover the real-world impact of charitable giving.',
      author: 'Jane Smith',
      publishedAt: '2024-01-15',
      status: 'published',
      tags: ['impact', 'donations', 'community']
    },
    draft: {
      id: 'blog-456',
      title: 'Upcoming Charity Events',
      content: 'Exciting events coming up this year...',
      status: 'draft',
      author: 'John Editor'
    }
  },

  // API responses
  apiResponses: {
    events: {
      success: {
        status: 200,
        data: {
          events: [
            // Include event data here
          ],
          pagination: {
            current_page: 1,
            total_pages: 5,
            total_count: 25
          }
        }
      },
      error: {
        status: 500,
        data: {
          message: 'Internal server error',
          error: 'Database connection failed'
        }
      }
    },
    donation: {
      success: {
        status: 200,
        data: {
          transactionId: 'txn_123456789',
          amount: 25,
          status: 'completed',
          receiptUrl: 'https://example.com/receipt/123456789'
        }
      },
      paymentFailed: {
        status: 400,
        data: {
          message: 'Payment failed',
          error: 'Your card was declined'
        }
      }
    }
  },

  // Form validation test data
  validation: {
    email: {
      valid: ['test@example.com', 'user.name@domain.co.uk', 'test+tag@gmail.com'],
      invalid: ['invalid-email', '@domain.com', 'test@', 'test@.com']
    },
    phone: {
      valid: ['+1234567890', '(555) 123-4567', '+44 20 7946 0958'],
      invalid: ['123', 'abc-def-ghij', '++123456789']
    },
    amount: {
      valid: ['10', '25.50', '100', '1000'],
      invalid: ['0', '-10', 'abc', '10.999']
    }
  }
};

module.exports = { testData };