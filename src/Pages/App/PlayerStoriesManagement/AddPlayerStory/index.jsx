import React, { useEffect, useState } from 'react';

import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../../../Hooks/useForm';

import useModalStore from '../../../../Store/ModalStore';

import { statusList } from '../../../../Constants';

import AddPlayerStoryService from './Services/AddPlayerStoryService';

import { addPlayerStoryValidationSchema } from './Validations';

import { showToast } from '../../../../Components/CustomToast';
import PageTitle from '../../../../Components/PageTitle';
import CustomCard from '../../../../Components/CustomCard';
import CustomInput from '../../../../Components/CustomInput';
import CustomButton from '../../../../Components/CustomButton';
import CustomSelect from '../../../../Components/CustomSelect';
import GetCategories from '../../CategoryManagement/Services/GetCategories';
import CustomImageUploader from '../../../../Components/CustomImageUploader';

const AddPlayerStory = () => {
  const queryClient = useQueryClient();
  const { showModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    data: categoryData,
    isLoading: isCategoryDataLoading,
    isError: isCategoryDataError,
  } = useQuery({
    queryKey: ['categoryData'],
    queryFn: () => GetCategories({}, {}),
  });

  useEffect(() => {
    if (categoryData) {
      const tempCategoryList = categoryData.data.map((category) => {
        return {
          label: category.name,
          value: category.id,
        };
      });
      setCategoryList(tempCategoryList);
      setSelectedCategory(tempCategoryList[0]?.value);
    }
  }, [categoryData]);

  const { mutate: addPlayerStoryMutation, isLoading } = useForm({
    showSuccessToast: false,

    onSuccess: (response) => {
      showModal({
        type: 'success',
        modalProps: {
          title: 'Successful',
          hideClose: true,
          message: response.message,
          continueText: 'Okay',
          onContinue: async () => {
            queryClient.invalidateQueries(['playerStories']);
            closeModal();
            navigate('/player-stories-management');
          },
        },
      });
    },
    onError: (error) => {
      showToast(
        error?.data?.message.failed || 'Player Story add failed',
        'error'
      );
    },
  });

  const handleSubmit = (values) => {
    const dataToSend = {
      ...values,
    };

    const formDataToSend = new FormData();
    formDataToSend.append('story_title', dataToSend.story_title);
    formDataToSend.append('category_id', dataToSend.category_id);
    formDataToSend.append('player_name', dataToSend.player_name);
    formDataToSend.append('published_by', dataToSend.published_by);
    formDataToSend.append('story_details', dataToSend.story_details);
    formDataToSend.append('story_link', dataToSend.story_link);
    formDataToSend.append('is_active', dataToSend.is_active);
    formDataToSend.append('file', dataToSend.file);

    showModal({
      type: 'question',
      modalProps: {
        title: 'Add Player Story?',
        message: 'Are you sure you want to add the Player Story?',
        continueText: 'Yes',
        cancelText: 'No',
        onContinue: async () => {
          addPlayerStoryMutation({
            service: AddPlayerStoryService,
            data: formDataToSend,
          });
          closeModal();
        },
      },
    });
  };

  return (
    <>
      <div className="addPlayerStoryScreen">
        <div className="row mb-4">
          <div className="col-12 col-xl-6">
            <PageTitle
              title="Add Player Story"
              backButton={true}
              backLink={'/player-stories-management'}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <CustomCard>
              <>
                <Formik
                  initialValues={{
                    story_title: '',
                    category_id: selectedCategory || categoryList[0]?.value || '',
                    player_name: '',
                    published_by: '',
                    story_details: '',
                    story_link: '',
                    file: '',
                    is_active: 1,
                  }}
                  validationSchema={addPlayerStoryValidationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    // isSubmitting,
                  }) => {
                    return (
                      <Form>
                        <div className="row mb-4">
                          <div className="col-xl-10">
                            <div className="row">
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Story Title"
                                    id="story_title"
                                    name="story_title"
                                    type="text"
                                    placeholder="Enter Story Title"
                                    value={values.story_title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.story_title && errors.story_title
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomSelect
                                    label="Category"
                                    id="category_id "
                                    name="category_id"
                                    placeholder="Select Category"
                                    className="w-100 fw-normal"
                                    labelClassName="mb-0"
                                    fullWidth
                                    options={categoryList || []}
                                    disabled={
                                      !categoryList ||
                                      isCategoryDataLoading ||
                                      isCategoryDataError
                                    }
                                    value={values.category_id || selectedCategory || categoryList[0]?.value}
                                    onChange={(e) => {
                                      setSelectedCategory(e.target.value);
                                      handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    error={
                                      touched.category_id && errors.category_id
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Player Name"
                                    id="player_name"
                                    name="player_name"
                                    type="text"
                                    placeholder="Enter Player Name"
                                    value={values.player_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.player_name && errors.player_name
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Published By"
                                    id="published_by"
                                    name="published_by"
                                    type="text"
                                    placeholder="Enter Published By"
                                    value={values.published_by}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.published_by &&
                                      errors.published_by
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Player Story Detailed"
                                    id="story_details"
                                    name="story_details"
                                    type="textarea"
                                    placeholder="Enter Player Story Detailed"
                                    rows={4}
                                    value={values.story_details}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.story_details &&
                                      errors.story_details
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomInput
                                    label="Story Link"
                                    id="story_link"
                                    name="story_link"
                                    type="url"
                                    placeholder="Enter Story Link"
                                    value={values.story_link}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.story_link && errors.story_link
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <div className="col-12">
                                    <div className="mb-3">
                                      <CustomSelect
                                        label="Status"
                                        id="is_active "
                                        name="is_active"
                                        placeholder="Select Status"
                                        className="w-100 fw-normal"
                                        labelClassName="mb-0"
                                        fullWidth
                                        options={statusList}
                                        disabled={!statusList}
                                        value={values.is_active}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        error={
                                          touched.is_active && errors.is_active
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <CustomImageUploader
                                    label="Upload Player Story Cover"
                                    required
                                    id="file"
                                    name="file"
                                    placeholder="Upload Player Story Cover"
                                    onChange={(e) => {
                                      handleChange({
                                        target: {
                                          name: 'file',
                                          value: e.target.files[0],
                                        },
                                      });
                                    }}
                                    onBlur={handleBlur}
                                    value={values.file}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col-12">
                            <div className="d-flex align-items-center gap-3">
                              <CustomButton
                                loading={isLoading}
                                text="Add Player Story"
                                type="submit"
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </>
            </CustomCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPlayerStory;
