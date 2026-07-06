import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/auth/login', data);
      onLogin(response.data);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-semibold">Login to Garment POS</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" {...register('email')} className="w-full rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" {...register('password')} className="w-full rounded border border-slate-200 px-3 py-2 outline-none focus:border-slate-900" required />
          </div>
          <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
