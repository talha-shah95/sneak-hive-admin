import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import GetBlogs from './Services/GetBlogs';
import ChangeBlogStatus from './Services/ChangeBlogStatus';

import useModalStore from '../../../Store/ModalStore';

import withFilters from '../../../HOC/withFilters ';
import { dateFormat } from '../../../Utils/Utils';

import { showToast } from '../../../Components/CustomToast';
import PageTitle from '../../../Components/PageTitle';
import CustomCard from '../../../Components/CustomCard';
import CustomTable from '../../../Components/CustomTable';
import CustomFilters from '../../../Components/CustomFilters';
import StatusDropdown from '../../../Components/StatisDropdown';
import CustomTableActionDropdown from '../../../Components/CustomTableActionDropdown';
import CustomButton from '../../../Components/CustomButton';

import { LuEye, LuPencil } from 'react-icons/lu';

const headers = [
  { id: 1, key: 'sNo', title: 'S.No' },
  { id: 2, key: 'blogTitle', title: 'Blog Title' },
  { id: 3, key: 'uploadDate', title: 'Upload Date' },
  { id: 4, key: 'status', title: 'Status' },
  { id: 5, key: 'action', title: 'Action' },
];

// eslint-disable-next-line react-refresh/only-export-components
const BlogsManagement = ({ filters, setFilters, pagination }) => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    isError: isBlogsError,
    error: blogsError,
  } = useQuery({
    queryKey: ['blogs', pagination, filters],
    queryFn: () => GetBlogs(filters, pagination),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
    retry: 2,
  });

  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationFn: (id) => ChangeBlogStatus(id),
    onSuccess: ({ message }) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: message || 'Blog status changed successfully!',
          continueText: 'Ok',
          onContinue: () => {
            closeModal();
          },
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['blogs', 'blogDetails'],
      });
    },
    onError: (error) => {
      showToast(error?.message || 'Status change failed', 'error');
    },
  });

  const handleChangeStatus = (id, status) => {
    const title = status == 1 ? 'Deactivate Blog?' : 'Activate Blog?';
    const message =
      status == 1
        ? 'Are you sure you want to deactivate the Blog?'
        : 'Are you sure you want to activate the Blog?';
    showModal({
      type: 'question',
      modalProps: {
        title: title,
        message: message,
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          await changeStatusMutation(id);
        },
      },
    });
  };

  return (
    <div className="blogsManagementScreen">
      <div className="row mb-4">
        <div className="col-12 col-xl-6">
          <PageTitle title="Blogs Management" />
        </div>
        <div className="col-12 col-xl-6 text-end">
          <CustomButton
            text="Add New Blog"
            to={'/blogs-management/add-blog'}
            className="w-auto d-inline-block"
            variant="secondary"
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <CustomCard>
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <CustomFilters
                    setFilters={setFilters}
                    filters={filters}
                    sorting={[
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                    ]}
                    search={true}
                    dateFilters={[
                      {
                        title: 'Upload Date',
                        from: 'from',
                        to: 'to',
                      },
                    ]}
                    // selectOptions={[
                    //   {
                    //     title: 'status',
                    //     options: [
                    //       { value: '', label: 'All' },
                    //       { value: '1', label: 'Active' },
                    //       { value: '0', label: 'Inactive' },
                    //     ],
                    //   },
                    // ]}
                    pagination={blogsData?.meta}
                  >
                    <CustomTable
                      headers={headers}
                      loading={isBlogsLoading}
                      rows={filters.per_page}
                      className="mt-4"
                    >
                      <tbody>
                        {isBlogsError ||
                          (blogsData?.data?.length == 0 && (
                            <tr>
                              <td
                                colSpan={headers?.length}
                                className="text-center"
                              >
                                {blogsError?.message || 'No data found'}
                              </td>
                            </tr>
                          ))}
                        {blogsData?.data?.map((blog, index) => (
                          <tr key={index}>
                            <td>
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </td>
                            <td>{blog?.title || '-'}</td>
                            <td>{dateFormat(blog?.created_at) || '-'}</td>
                            <td>
                              <StatusDropdown
                                selected={
                                  blog?.is_active == 0
                                    ? { value: 0, label: 'Inactive' }
                                    : blog?.is_active == 1
                                    ? { value: 1, label: 'Active' }
                                    : { value: 2, label: 'Pending' }
                                }
                                options={[
                                  {
                                    value: blog?.is_active == 1 ? 0 : 1,
                                    label:
                                      blog?.is_active == 1
                                        ? 'Inactive'
                                        : 'Active',
                                    onClick: () => {
                                      handleChangeStatus(
                                        blog?.id,
                                        blog?.is_active
                                      );
                                    },
                                  },
                                ]}
                              />
                            </td>
                            <td>
                              <CustomTableActionDropdown
                                actions={[
                                  {
                                    icon: <LuEye />,
                                    label: 'View',
                                    onClick: () => {
                                      navigate(
                                        `/blogs-management/blog-details/${blog?.id}`
                                      );
                                    },
                                  },
                                  {
                                    icon: <LuPencil />,
                                    label: 'Edit',
                                    onClick: () => {
                                      navigate(
                                        `/blogs-management/edit-blog/${blog?.id}`
                                      );
                                    },
                                  },
                                ]}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </CustomTable>
                  </CustomFilters>
                </div>
              </div>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default withFilters(BlogsManagement);
