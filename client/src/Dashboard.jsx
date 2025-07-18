import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
} from 'chart.js';
import { differenceInDays, parseISO, format, isSameDay, subDays } from 'date-fns';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UndoIcon from '@mui/icons-material/Undo';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import { ArcElement } from 'chart.js';
import Tooltip from '@mui/material/Tooltip';
import Grow from '@mui/material/Grow';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
ChartJS.register(ArcElement);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend
);

import UserInfo from './components/UserInfo';
import WeightList from './components/WeightList';
import ActivityList from './components/ActivityList';
import WeightChart from './components/WeightChart';
import ActivityChart from './components/ActivityChart';
import CaloriesChart from './components/CaloriesChart';
import PieChart from './components/PieChart';
import TrendsInsights from './components/TrendsInsights';

let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://week-7-devops-deployment-assignment-dxo6.onrender.com';
if (!API_BASE_URL.endsWith('/api')) API_BASE_URL += '/api';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Chart color helpers must be defined before any chart data/options that use them
  const chartTextColor = theme.palette.text.primary;
  const chartBgColor = theme.palette.background.paper;
  const [user, setUser] = useState(null);
  const [weights, setWeights] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();



  const [weightPage, setWeightPage] = useState(1);
  const [weightTotalPages, setWeightTotalPages] = useState(1);
  const [weightFilters, setWeightFilters] = useState({ startDate: '', endDate: '', unit: '', search: '' });

  const fetchWeights = useCallback(async (page = 1, filters = weightFilters) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    params.append('page', page);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.unit) params.append('unit', filters.unit);
    if (filters.search) params.append('search', filters.search);
    try {
      const res = await axios.get(`${API_BASE_URL}/weights?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWeights(res.data.weights || []);
    setWeightTotalPages(res.data.totalPages || 1);
    } catch {
      setError('Failed to fetch weights.');
    }
  }, [weightFilters]);

  const [activityPage, setActivityPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [activityFilters, setActivityFilters] = useState({ startDate: '', endDate: '', type: '', unit: '', search: '' });

  const fetchActivities = useCallback(async (page = 1, filters = activityFilters) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    params.append('page', page);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.type) params.append('type', filters.type);
    if (filters.unit) params.append('unit', filters.unit);
    if (filters.search) params.append('search', filters.search);
    try {
      const res = await axios.get(`${API_BASE_URL}/activities?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setActivities(res.data.activities || []);
    setActivityTotalPages(res.data.totalPages || 1);
    } catch {
      setError('Failed to fetch activities.');
    }
  }, [activityFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setWeightFilters(f => ({ ...f, [name]: value }));
  };
  const handleApplyFilters = () => {
    setWeightPage(1);
    fetchWeights(1, weightFilters);
  };

  const handleActivityFilterChange = (e) => {
    const { name, value } = e.target;
    setActivityFilters(f => ({ ...f, [name]: value }));
  };
  const handleApplyActivityFilters = () => {
    setActivityPage(1);
    fetchActivities(1, activityFilters);
  };

  const handleExportWeights = async () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (weightFilters.startDate) params.append('startDate', weightFilters.startDate);
    if (weightFilters.endDate) params.append('endDate', weightFilters.endDate);
    if (weightFilters.unit) params.append('unit', weightFilters.unit);
    if (weightFilters.search) params.append('search', weightFilters.search);
    try {
      const res = await axios.get(`${API_BASE_URL}/weights/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'weights.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Failed to export weights.');
    }
  };

  const handleExportActivities = async () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (activityFilters.startDate) params.append('startDate', activityFilters.startDate);
    if (activityFilters.endDate) params.append('endDate', activityFilters.endDate);
    if (activityFilters.type) params.append('type', activityFilters.type);
    if (activityFilters.unit) params.append('unit', activityFilters.unit);
    if (activityFilters.search) params.append('search', activityFilters.search);
    try {
      const res = await axios.get(`${API_BASE_URL}/activities/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'activities.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Failed to export activities.');
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in.');
      setLoading(false);
      return;
    }
    try {
      // Fetch user info
      const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);
      // Fetch paginated weights
      await fetchWeights(weightPage);
      // Fetch paginated activities
      await fetchActivities(activityPage);
    } catch {
      setError('Failed to load dashboard data. Please check your connection and try again.');
    }
    setLoading(false);
  }, [weightPage, activityPage, fetchWeights, fetchActivities]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchActivities(activityPage);
  }, [activityPage, fetchActivities]);

  // Memoize expensive calculations and chart data
  const weightChartData = useMemo(() => ({
    labels: weights.map(w => w.date?.slice(0, 10)),
    datasets: [
      {
        label: 'Weight',
        data: weights.map(w => w.weight),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  }), [weights]);

  const activitySummary = useMemo(() => activities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + a.duration;
    return acc;
  }, {}), [activities]);
  const activityTypes = useMemo(() => Object.keys(activitySummary), [activitySummary]);
  const activityDurations = useMemo(() => Object.values(activitySummary), [activitySummary]);
  const activityChartData = useMemo(() => ({
    labels: activityTypes,
    datasets: [
      {
        label: 'Total Duration',
        data: activityDurations,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(100, 181, 246, 0.7)' : 'rgba(153, 102, 255, 0.5)',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(100, 181, 246, 1)' : 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }), [activityTypes, activityDurations, theme.palette.mode]);

  const caloriesData = useMemo(() => activities.filter(a => (a.caloriesBurned || 0) > 0), [activities]);
  const caloriesLabels = useMemo(() => caloriesData.map(a => a.date?.slice(0, 10)), [caloriesData]);
  const caloriesValues = useMemo(() => caloriesData.map(a => a.caloriesBurned), [caloriesData]);
  const caloriesTypes = useMemo(() => caloriesData.map(a => a.type), [caloriesData]);
  const caloriesNotes = useMemo(() => caloriesData.map(a => a.notes), [caloriesData]);
  const avgCalories = useMemo(() => caloriesValues.length ? (caloriesValues.reduce((a, b) => a + b, 0) / caloriesValues.length) : 0, [caloriesValues]);
  const caloriesChartData = useMemo(() => ({
    labels: caloriesLabels,
    datasets: [
      {
        label: 'Calories Burned',
        data: caloriesValues,
        fill: false,
        borderColor: '#e67e22',
        backgroundColor: 'rgba(230, 126, 34, 0.2)',
        tension: 0.2,
        pointBackgroundColor: '#e67e22',
        pointRadius: 6,
      },
      avgCalories > 0 && {
        label: 'Average',
        data: Array(caloriesValues.length).fill(avgCalories),
        borderColor: '#2980b9',
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
        type: 'line',
      }
    ].filter(Boolean),
  }), [caloriesLabels, caloriesValues, avgCalories]);

  const activityTypeCounts = useMemo(() => activities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {}), [activities]);
  const pieLabels = useMemo(() => Object.keys(activityTypeCounts), [activityTypeCounts]);
  const pieData = useMemo(() => Object.values(activityTypeCounts), [activityTypeCounts]);
  const maxCount = useMemo(() => Math.max(...pieData, 0), [pieData]);
  const highlightIndex = useMemo(() => pieData.findIndex(v => v === maxCount), [pieData, maxCount]);
  const pieChartData = useMemo(() => {
    const pieColors = [
      '#3498db', '#27ae60', '#e67e22', '#9b59b6', '#f1c40f', '#e74c3c', '#34495e', '#1abc9c'
    ];
    return {
      labels: pieLabels,
      datasets: [
        {
          label: 'Activity Distribution',
          data: pieData,
          backgroundColor: pieLabels.map((_, i) => i === highlightIndex ? '#2ecc71' : pieColors[i % pieColors.length]),
          borderColor: pieLabels.map((_, i) => i === highlightIndex ? '#145a32' : '#fff'),
          borderWidth: pieLabels.map((_, i) => i === highlightIndex ? 4 : 2),
          hoverOffset: 10,
        },
      ],
    };
  }, [pieLabels, pieData, highlightIndex]);

  // Memoize expensive trends/insights calculations
  const weightChange = useMemo(() => {
    if (weights.length > 1) {
      const sortedWeights = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
      const first = sortedWeights[0];
      const last = sortedWeights[sortedWeights.length - 1];
      return {
        value: (last.weight - first.weight).toFixed(1),
        unit: last.unit,
        from: first.weight,
        to: last.weight,
        startDate: first.date?.slice(0, 10),
        endDate: last.date?.slice(0, 10)
      };
    }
    return null;
  }, [weights]);
  const weightChange7 = useMemo(() => {
    if (weights.length > 1) {
      const sortedWeights = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
      const now = new Date();
      const w7 = sortedWeights.filter(w => differenceInDays(now, parseISO(w.date)) <= 7);
      if (w7.length > 1) {
        return {
          value: (w7[w7.length-1].weight - w7[0].weight).toFixed(1),
          unit: w7[w7.length-1].unit,
          from: w7[0].weight,
          to: w7[w7.length-1].weight,
          startDate: w7[0].date?.slice(0, 10),
          endDate: w7[w7.length-1].date?.slice(0, 10)
        };
      }
    }
    return null;
  }, [weights]);
  const weightChange30 = useMemo(() => {
    if (weights.length > 1) {
      const sortedWeights = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
      const now = new Date();
      const w30 = sortedWeights.filter(w => differenceInDays(now, parseISO(w.date)) <= 30);
      if (w30.length > 1) {
        return {
          value: (w30[w30.length-1].weight - w30[0].weight).toFixed(1),
          unit: w30[w30.length-1].unit,
          from: w30[0].weight,
          to: w30[w30.length-1].weight,
          startDate: w30[0].date?.slice(0, 10),
          endDate: w30[w30.length-1].date?.slice(0, 10)
        };
      }
    }
    return null;
  }, [weights]);
  const mostFrequentActivity = useMemo(() => {
    if (activities.length > 0) {
      const freq = activities.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {});
      const max = Math.max(...Object.values(freq));
      return Object.keys(freq).find(type => freq[type] === max);
    }
    return null;
  }, [activities]);
  const streak = useMemo(() => {
    if (activities.length > 0) {
      const days = activities.map(a => format(parseISO(a.date), 'yyyy-MM-dd'));
      const uniqueDays = Array.from(new Set(days)).sort((a, b) => new Date(b) - new Date(a));
      let current = new Date();
      let streak = 0;
      for (let i = 0; i < uniqueDays.length; i++) {
        if (isSameDay(current, parseISO(uniqueDays[i]))) {
          streak++;
          current = subDays(current, 1);
        } else {
          break;
        }
      }
      return streak;
    }
    return 0;
  }, [activities]);
  const totalActivities = useMemo(() => activities.length, [activities]);
  const totalDuration = useMemo(() => activities.reduce((sum, a) => sum + (a.duration || 0), 0), [activities]);
  const longestSession = useMemo(() => activities.length > 0 ? Math.max(...activities.map(a => a.duration || 0)) : null, [activities]);
  const mostActiveDay = useMemo(() => {
    if (activities.length > 0) {
      const dayCounts = activities.reduce((acc, a) => {
        const day = format(parseISO(a.date), 'EEEE');
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});
      const max = Math.max(...Object.values(dayCounts));
      return Object.keys(dayCounts).find(day => dayCounts[day] === max);
    }
    return null;
  }, [activities]);
  // Goals
  const [weightGoal, setWeightGoal] = useState(() => {
    const saved = localStorage.getItem('weightGoal');
    return saved ? parseFloat(saved) : '';
  });
  const [goalInput, setGoalInput] = useState(weightGoal || '');
  const [goalMsg, setGoalMsg] = useState('');
  const handleGoalSave = (e) => {
    e.preventDefault();
    if (!goalInput || isNaN(goalInput)) {
      setGoalMsg('Please enter a valid number.');
      return;
    }
    setWeightGoal(parseFloat(goalInput));
    localStorage.setItem('weightGoal', goalInput);
    setGoalMsg('Goal saved!');
    setTimeout(() => setGoalMsg(''), 1500);
  };

  const goalProgress = useMemo(() => {
    if (weightGoal && weights.length > 0) {
      const latest = weights.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
      const start = weights.reduce((a, b) => new Date(a.date) < new Date(b.date) ? a : b);
      const total = Math.abs(weightGoal - start.weight);
      const done = Math.abs(latest.weight - start.weight);
      const percent = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
      return { percent, latest: latest.weight, goal: weightGoal, unit: latest.unit };
    }
    return null;
  }, [weightGoal, weights]);

  // Prepare activity chart data (sum durations by type)
  const activityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: chartTextColor }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Total Duration: ${context.parsed.y}`;
          }
        }
      }
    },
    animation: { duration: 800 },
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: chartTextColor } },
      y: { ticks: { color: chartTextColor } },
    },
    backgroundColor: chartBgColor,
  };

  // Calories burned over time (line chart)
  const caloriesChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const idx = context.dataIndex;
            let label = `Calories: ${context.parsed.y}`;
            if (caloriesTypes[idx]) label += ` | ${caloriesTypes[idx]}`;
            if (caloriesNotes[idx]) label += ` (${caloriesNotes[idx]})`;
            return label;
          }
        }
      }
    },
    animation: { duration: 800 },
    maintainAspectRatio: false,
  };

  // Activity type distribution (pie chart)
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { font: { size: 14, weight: 'bold' } }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percent = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percent}%)`;
          }
        }
      }
    },
    animation: { duration: 800 },
    maintainAspectRatio: false,
  };

  // Motivational quotes
  const quotes = [
    '“The journey of a thousand miles begins with a single step.” – Lao Tzu',
    '“Success is the sum of small efforts, repeated day in and day out.” – Robert Collier',
    '“Don’t limit your challenges. Challenge your limits.”',
    '“It’s not about having time. It’s about making time.”',
    '“You don’t have to be extreme, just consistent.”',
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Pagination for weights and activities
  const [showWeights, setShowWeights] = useState(5);
  const [showActivities, setShowActivities] = useState(5);
  const [weightPageSize, setWeightPageSize] = useState(5);
  const [activityPageSize, setActivityPageSize] = useState(5);
  const weightsListRef = React.useRef(null);
  const activitiesListRef = React.useRef(null);
  const handleShowMoreWeights = () => {
    setShowWeights(w => {
      const newVal = Math.min(w + weightPageSize, weights.length);
      setTimeout(() => {
        if (weightsListRef.current) {
          weightsListRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
      return newVal;
    });
  };
  const handleShowLessWeights = () => setShowWeights(weightPageSize);
  const handleShowMoreActivities = () => {
    setShowActivities(a => {
      const newVal = Math.min(a + activityPageSize, activities.length);
      setTimeout(() => {
        if (activitiesListRef.current) {
          activitiesListRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
      return newVal;
    });
  };
  const handleShowLessActivities = () => setShowActivities(activityPageSize);

  // Edit/delete state
  const [editingWeightId, setEditingWeightId] = useState(null);
  const [editingWeight, setEditingWeight] = useState({});
  const [deletingWeightId, setDeletingWeightId] = useState(null);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editingActivity, setEditingActivity] = useState({});
  const [deletingActivityId, setDeletingActivityId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });
  const showSnackbar = (message, type = 'success') => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => setSnackbar({ open: false, message: '', type: 'success' }), 2500);
  };
  // Modal state
  const [modal, setModal] = useState({ open: false, type: '', id: null });
  // Undo state
  const [undoData, setUndoData] = useState(null);
  // Auto-focus ref
  const editWeightInputRef = useRef(null);
  const editActivityInputRef = useRef(null);
  useEffect(() => {
    if (editingWeightId && editWeightInputRef.current) {
      editWeightInputRef.current.focus();
    }
    if (editingActivityId && editActivityInputRef.current) {
      editActivityInputRef.current.focus();
    }
  }, [editingWeightId, editingActivityId]);

  // Delete weight (with modal and undo)
  const handleDeleteWeight = (id) => setModal({ open: true, type: 'weight', id });
  const confirmDeleteWeight = async () => {
    setDeletingWeightId(modal.id);
    const deleted = weights.find(w => w._id === modal.id);
    setWeights(ws => ws.filter(w => w._id !== modal.id));
    setModal({ open: false, type: '', id: null });
    setUndoData({ type: 'weight', data: deleted });
    showSnackbar('Weight entry deleted. Undo?', 'info');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/weights/${deleted._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      showSnackbar('Failed to delete weight entry.', 'error');
      setWeights(ws => [...ws, deleted]);
    }
    setDeletingWeightId(null);
  };
  // Undo weight delete
  const handleUndo = async () => {
    if (undoData?.type === 'weight') {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_BASE_URL}/weights`, undoData.data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWeights(ws => [...ws, res.data]);
        showSnackbar('Weight entry restored!', 'success');
      } catch {
        showSnackbar('Failed to restore entry.', 'error');
      }
    }
    if (undoData?.type === 'activity') {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_BASE_URL}/activities`, undoData.data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(as => [...as, res.data]);
        showSnackbar('Activity entry restored!', 'success');
      } catch {
        showSnackbar('Failed to restore entry.', 'error');
      }
    }
    setUndoData(null);
  };
  // Delete activity (with modal and undo)
  const handleDeleteActivity = (id) => setModal({ open: true, type: 'activity', id });
  const confirmDeleteActivity = async () => {
    setDeletingActivityId(modal.id);
    const deleted = activities.find(a => a._id === modal.id);
    setActivities(as => as.filter(a => a._id !== modal.id));
    setModal({ open: false, type: '', id: null });
    setUndoData({ type: 'activity', data: deleted });
    showSnackbar('Activity entry deleted. Undo?', 'info');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/activities/${deleted._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      showSnackbar('Failed to delete activity entry.', 'error');
      setActivities(as => [...as, deleted]);
    }
    setDeletingActivityId(null);
  };
  // Edit weight
  const handleEditWeight = (w) => {
    setEditingWeightId(w._id);
    setEditingWeight({ ...w });
  };
  const handleSaveWeight = async () => {
    setDeletingWeightId(editingWeightId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE_URL}/weights/${editingWeightId}`, editingWeight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeights(ws => ws.map(w => w._id === editingWeightId ? res.data : w));
      setEditingWeightId(null);
    } catch {
      alert('Failed to update weight entry.');
    }
    setDeletingWeightId(null);
  };
  // Edit activity
  const handleEditActivity = (a) => {
    setEditingActivityId(a._id);
    setEditingActivity({ ...a });
  };
  const handleSaveActivity = async () => {
    setDeletingActivityId(editingActivityId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE_URL}/activities/${editingActivityId}`, editingActivity, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(as => as.map(a => a._id === editingActivityId ? res.data : a));
      setEditingActivityId(null);
    } catch {
      alert('Failed to update activity entry.');
    }
    setDeletingActivityId(null);
  };

  // Update chart options for dark mode
  const weightChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top', labels: { color: chartTextColor } },
      tooltip: {
        callbacks: {
          label: function(context) {
            const idx = context.dataIndex;
            let label = `Calories: ${context.parsed.y}`;
            if (caloriesTypes[idx]) label += ` | ${caloriesTypes[idx]}`;
            if (caloriesNotes[idx]) label += ` (${caloriesNotes[idx]})`;
            return label;
          }
        }
      }
    },
    animation: { duration: 800 },
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: chartTextColor } },
      y: { ticks: { color: chartTextColor } },
    },
    backgroundColor: chartBgColor,
  };
  // Repeat for other charts (caloriesChartOptions, pieChartOptions, etc.)

  // --- New Analytics ---
  // Weekly and monthly weight change (already calculated as weightChange7, weightChange30)
  // Best streak (already calculated as streak)
  // Average session duration
  const avgSessionDuration = useMemo(() => {
    if (activities.length === 0) return 0;
    return (activities.reduce((sum, a) => sum + (a.duration || 0), 0) / activities.length).toFixed(1);
  }, [activities]);
  // Personal bests
  const lowestWeight = useMemo(() => {
    if (weights.length === 0) return null;
    return weights.reduce((min, w) => w.weight < min.weight ? w : min, weights[0]);
  }, [weights]);
  const longestActivity = useMemo(() => {
    if (activities.length === 0) return null;
    return activities.reduce((max, a) => (a.duration || 0) > (max.duration || 0) ? a : max, activities[0]);
  }, [activities]);
  // --- End New Analytics ---

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <div style={{
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #3498db',
        borderRadius: '50%',
        width: 40,
        height: 40,
        animation: 'spin 1s linear infinite',
        marginBottom: 10
      }}
      className="spinner"></div>
      <span>Loading dashboard...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
  if (error) return (
    <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>
      <p style={{ fontSize: 18, fontWeight: 500 }}>
        <span role="img" aria-label="error">⚠️</span> Oops! Something went wrong loading your dashboard.<br />
        <span style={{ color: '#555', fontSize: 15 }}>{error}</span>
      </p>
      <button
        onClick={fetchData}
        style={{ marginTop: 10, padding: '8px 20px', fontSize: 16, borderRadius: 5, background: '#3498db', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        disabled={loading}
      >
        {loading ? (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #fff',
              borderRadius: '50%',
              width: 18,
              height: 18,
              marginRight: 8,
              animation: 'spin 1s linear infinite',
              display: 'inline-block'
            }} />
            Retrying...
          </span>
        ) : 'Retry'}
      </button>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 4 }, bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      <Box sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
        {/* New Analytics Mini-Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grow in timeout={600}><Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: 'background.paper', boxShadow: 4 }}>
              <Tooltip title="Weight change in the last 7 days" arrow>
                <Box>
                  <TrendingUpIcon color={weightChange7 && parseFloat(weightChange7.value) < 0 ? 'success' : 'warning'} sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle2">7d Weight</Typography>
                  <Typography variant="h6" color={weightChange7 && parseFloat(weightChange7.value) < 0 ? 'success.main' : 'warning.main'}>
                    {weightChange7 ? `${parseFloat(weightChange7.value) < 0 ? '⬇️' : '⬆️'} ${Math.abs(weightChange7.value)} ${weightChange7.unit}` : '--'}
                  </Typography>
                </Box>
              </Tooltip>
            </Paper>
          </Grid></Grow>
          <Grow in timeout={800}><Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: 'background.paper', boxShadow: 4 }}>
              <Tooltip title="Weight change in the last 30 days" arrow>
                <Box>
                  <TrendingDownIcon color={weightChange30 && parseFloat(weightChange30.value) < 0 ? 'success' : 'warning'} sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle2">30d Weight</Typography>
                  <Typography variant="h6" color={weightChange30 && parseFloat(weightChange30.value) < 0 ? 'success.main' : 'warning.main'}>
                    {weightChange30 ? `${parseFloat(weightChange30.value) < 0 ? '⬇️' : '⬆️'} ${Math.abs(weightChange30.value)} ${weightChange30.unit}` : '--'}
                  </Typography>
                </Box>
              </Tooltip>
            </Paper>
          </Grid></Grow>
          <Grow in timeout={1000}><Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: 'background.paper', boxShadow: 4 }}>
              <Tooltip title="Best activity streak (consecutive days)" arrow>
                <Box>
                  <StarIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle2">Best Streak</Typography>
                  <Typography variant="h6" color="info.main">{streak} days</Typography>
                </Box>
              </Tooltip>
            </Paper>
          </Grid></Grow>
          <Grow in timeout={1200}><Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: 'background.paper', boxShadow: 4 }}>
              <Tooltip title="Average activity session duration" arrow>
                <Box>
                  <TimerIcon color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle2">Avg. Session</Typography>
                  <Typography variant="h6" color="secondary.main">{avgSessionDuration} min</Typography>
                </Box>
              </Tooltip>
            </Paper>
          </Grid></Grow>
          <Grow in timeout={1400}><Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: 'background.paper', boxShadow: 4 }}>
              <Tooltip title="Personal bests: lowest weight and longest activity" arrow>
                <Box>
                  <FitnessCenterIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle2">Personal Bests</Typography>
                  <Typography variant="body2" color="primary.main">
                    {lowestWeight ? `Lowest: ${lowestWeight.weight} ${lowestWeight.unit}` : '--'}
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    {longestActivity ? `Longest: ${longestActivity.duration} ${longestActivity.unit}` : '--'}
                  </Typography>
                </Box>
              </Tooltip>
            </Paper>
          </Grid></Grow>
        </Grid>
        {/* Dashboard Header */}
        <Typography 
          variant={isMobile ? 'h5' : 'h3'} 
          align="center" 
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Dashboard
        </Typography>
        <UserInfo user={user} />
        {/* Responsive Grid Layout */}
        <Grid container spacing={3}>
          {/* Trends & Insights Section */}
          <Grid item xs={12} md={6}>
        <TrendsInsights
          weightChange={weightChange}
          weightChange7={weightChange7}
          weightChange30={weightChange30}
          mostFrequentActivity={mostFrequentActivity}
          totalActivities={totalActivities}
          totalDuration={totalDuration}
          longestSession={longestSession}
          mostActiveDay={mostActiveDay}
          streak={streak}
          encouragement={randomQuote}
          goalMsg={goalMsg}
          weightGoal={weightGoal}
          weights={weights}
          goalProgress={goalProgress}
          handleGoalSave={handleGoalSave}
          goalInput={goalInput}
          setGoalInput={setGoalInput}
          SaveIcon={SaveIcon}
        />
          </Grid>
          {/* Weight Chart */}
          <Grid item xs={12} md={6}>
            <WeightChart
              weightChartData={weightChartData}
              weightChartOptions={weightChartOptions}
              weights={weights}
            />
          </Grid>
          {/* Activity Chart */}
          <Grid item xs={12} md={6}>
            <ActivityChart
              activityChartData={activityChartData}
              activityChartOptions={activityChartOptions}
              activityTypes={activityTypes}
            />
          </Grid>
          {/* Calories Chart */}
          <Grid item xs={12} md={6}>
            <CaloriesChart
              caloriesChartData={caloriesChartData}
              caloriesChartOptions={caloriesChartOptions}
              caloriesLabels={caloriesLabels}
            />
          </Grid>
          {/* Pie Chart */}
          <Grid item xs={12} md={6}>
            <PieChart
              pieChartData={pieChartData}
              pieChartOptions={pieChartOptions}
              pieLabels={pieLabels}
            />
          </Grid>
        </Grid>
        {/* Weight Filters & List */}
        <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, sm: 3 }, mt: 4, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Weight Entries</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={weightFilters.startDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={weightFilters.endDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              select
              label="Unit"
              name="unit"
              value={weightFilters.unit}
              onChange={handleFilterChange}
              size="small"
              style={{ minWidth: 80 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="lb">lb</MenuItem>
            </TextField>
            <TextField
              label="Search Notes"
              name="search"
              value={weightFilters.search}
              onChange={handleFilterChange}
              size="small"
            />
            <Button variant="contained" onClick={handleApplyFilters}>Apply Filters</Button>
            <Button variant="outlined" onClick={handleExportWeights} sx={{ mb: 2 }}>Export Weights as CSV</Button>
          </Box>
        <WeightList
          weights={weights}
          showWeights={showWeights}
          setShowWeights={setShowWeights}
          weightPageSize={weightPageSize}
          setWeightPageSize={setWeightPageSize}
          editingWeightId={editingWeightId}
          setEditingWeightId={setEditingWeightId}
          editingWeight={editingWeight}
          setEditingWeight={setEditingWeight}
          deletingWeightId={deletingWeightId}
          handleEditWeight={handleEditWeight}
          handleSaveWeight={handleSaveWeight}
          handleDeleteWeight={handleDeleteWeight}
          confirmDeleteWeight={confirmDeleteWeight}
          weightsListRef={weightsListRef}
          handleShowMoreWeights={handleShowMoreWeights}
          handleShowLessWeights={handleShowLessWeights}
          navigate={navigate}
          user={user}
          randomQuote={randomQuote}
        />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={() => setWeightPage(p => Math.max(1, p - 1))}
              disabled={weightPage === 1}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
            <Typography variant="body2" sx={{ alignSelf: 'center' }}>
              Page {weightPage} of {weightTotalPages}
            </Typography>
            <Button
              onClick={() => setWeightPage(p => Math.min(weightTotalPages, p + 1))}
              disabled={weightPage === weightTotalPages}
              variant="outlined"
              sx={{ ml: 2 }}
            >
              Next
            </Button>
          </Box>
        </Paper>
        {/* Activity Filters & List */}
        <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Activity Entries</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={activityFilters.startDate}
              onChange={handleActivityFilterChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={activityFilters.endDate}
              onChange={handleActivityFilterChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              select
              label="Type"
              name="type"
              value={activityFilters.type}
              onChange={handleActivityFilterChange}
              size="small"
              style={{ minWidth: 100 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="run">Run</MenuItem>
              <MenuItem value="walk">Walk</MenuItem>
              <MenuItem value="swim">Swim</MenuItem>
              <MenuItem value="cycle">Cycle</MenuItem>
              {/* Add more types as needed */}
            </TextField>
            <TextField
              select
              label="Unit"
              name="unit"
              value={activityFilters.unit}
              onChange={handleActivityFilterChange}
              size="small"
              style={{ minWidth: 80 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="minutes">minutes</MenuItem>
              <MenuItem value="hours">hours</MenuItem>
            </TextField>
            <TextField
              label="Search Notes"
              name="search"
              value={activityFilters.search}
              onChange={handleActivityFilterChange}
              size="small"
            />
            <Button variant="contained" onClick={handleApplyActivityFilters}>Apply Filters</Button>
            <Button variant="outlined" onClick={handleExportActivities} sx={{ mb: 2 }}>Export Activities as CSV</Button>
          </Box>
        <ActivityList
          activities={activities}
          showActivities={showActivities}
          setShowActivities={setShowActivities}
          activityPageSize={activityPageSize}
          setActivityPageSize={setActivityPageSize}
          editingActivityId={editingActivityId}
          setEditingActivityId={setEditingActivityId}
          editingActivity={editingActivity}
          setEditingActivity={setEditingActivity}
          deletingActivityId={deletingActivityId}
          handleEditActivity={handleEditActivity}
          handleSaveActivity={handleSaveActivity}
          handleDeleteActivity={handleDeleteActivity}
          confirmDeleteActivity={confirmDeleteActivity}
          activitiesListRef={activitiesListRef}
          handleShowMoreActivities={handleShowMoreActivities}
          handleShowLessActivities={handleShowLessActivities}
          navigate={navigate}
          user={user}
          randomQuote={randomQuote}
        />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={() => setActivityPage(p => Math.max(1, p - 1))}
              disabled={activityPage === 1}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
            <Typography variant="body2" sx={{ alignSelf: 'center' }}>
              Page {activityPage} of {activityTotalPages}
            </Typography>
            <Button
              onClick={() => setActivityPage(p => Math.min(activityTotalPages, p + 1))}
              disabled={activityPage === activityTotalPages}
              variant="outlined"
              sx={{ ml: 2 }}
            >
              Next
            </Button>
          </Box>
        </Paper>
        {/* Snackbar, Modal, and other global UI elements remain here */}
        {/* Modal for delete confirmation */}
        {modal.open && (
          <Dialog
            open={modal.open}
            onClose={() => setModal({ open: false, type: '', id: null })}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              <WarningAmberIcon fontSize="large" />
            </DialogTitle>
            <DialogContent>
              <Typography id="delete-dialog-description">
                Are you sure you want to delete this {modal.type} entry?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={modal.type === 'weight' ? confirmDeleteWeight : confirmDeleteActivity} color="error" variant="contained">
                Delete
              </Button>
              <Button onClick={() => setModal({ open: false, type: '', id: null })} color="primary" variant="outlined">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.type} sx={{ width: '100%' }}>
            {snackbar.message} {undoData && snackbar.type === 'info' && (
              <Button onClick={handleUndo} color="inherit" size="small">
                Undo
              </Button>
            )}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Dashboard; 