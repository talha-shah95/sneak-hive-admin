import { useMutation } from '@tanstack/react-query';
import { showToast } from '../Components/CustomToast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
export function useForm({
  onSuccess,
  onError,
  transformData,
  successMessage = 'Request successful!',
  redirectTo,
  showSuccessToast = true,
  showErrorToast = true,
} = {}) {
  const navigate = useNavigate();
  //retun loading state amd mutate function
  const [isLoading, setIsLoading] = useState(false);
  const mutation = useMutation({
    mutationFn: async ({ service, data }) => {
      // Transform data if transformer function is provided
      const transformedData = transformData ? transformData(data) : data;
      setIsLoading(true);
      const response = await service(transformedData);
      setIsLoading(false);
      return response;
    },
    onSuccess: (response, variables, context) => {
      // Handle success toast
      if (showSuccessToast) {
        showToast(successMessage, 'success');
      }

      // Handle custom success callback
      if (onSuccess) {
        onSuccess(response, variables, context);
      }

      // Handle redirect if specified 
      if (redirectTo) {
        navigate(redirectTo);
      }
    },
    onError: (error, variables, context) => {
      // Handle error toast
      if (showErrorToast) {
        const errorMessage =
          error?.message || error?.error || error || 'An error occurred';
        showToast(errorMessage, 'error');
        setIsLoading(false);
      }

      // Handle custom error callback
      if (onError) {
        onError(error, variables, context);
      }
    },
  });
  return { isLoading, mutate: mutation.mutate };
}
