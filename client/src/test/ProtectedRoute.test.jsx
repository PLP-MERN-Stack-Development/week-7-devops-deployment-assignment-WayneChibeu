import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProtectedRoute from '../ProtectedRoute';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderProtectedRoute = (hasToken = true) => {
  if (hasToken) {
    localStorage.getItem.mockReturnValue('mock-token');
  } else {
    localStorage.getItem.mockReturnValue(null);
  }

  const theme = createTheme();
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders children when user is authenticated', () => {
    renderProtectedRoute(true);
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('redirects to login when user is not authenticated', () => {
    renderProtectedRoute(false);
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('checks for token in localStorage', () => {
    renderProtectedRoute(true);
    
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('redirects immediately when no token is found', () => {
    renderProtectedRoute(false);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
}); 