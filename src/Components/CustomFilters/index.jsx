import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { Dropdown } from 'react-bootstrap';
import { LuFilter, LuSearch } from 'react-icons/lu';

import CustomButton from '../CustomButton';
import CustomSelect from '../CustomSelect';
import CustomInput from '../CustomInput';
import CustomPagination from '../CustomPagination';

import './style.css';

const CustomFilters = ({
  children,
  filters,
  setFilters,
  sorting,
  search,
  dateFilters,
  selectOptions,
  pagination,
}) => {
  const [formData, setFormData] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setFormData(filters);
  }, [filters]);

  const debouncedSetFilters = useCallback(
    debounce((updatedFormData) => {
      setFilters(updatedFormData);
    }, 500),
    [setFilters]
  );

  const handleChange = (name, value) => {
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    if (name === 'search') {
      debouncedSetFilters(updatedFormData);
    } else if (name === 'per_page') {
      setFilters(updatedFormData);
    }
  };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   handleChange(name, value);
  // };

  const handleDateInputChange = (name, value) => {
    handleChange(name, value);
  };

  const handleSearchChange = (value) => {
    handleChange('search', value);
  };

  const handleSelectChange = (name, value) => {
    handleChange(name, value);
  };

  const handleApply = () => {
    setFilters(formData);
    // Close the dropdown after applying filters
    setShowDropdown(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      page: 1,
      per_page: 5,
    };
    setFormData(clearedFilters);
    setFilters(clearedFilters);
    // Close the dropdown after clearing filters
    setShowDropdown(false);
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="tableFilters">
            <div className="d-flex justify-content-between gap-3 flex-wrap align-items-center">
              <div className="d-flex align-items-center gap-2">
                {sorting && (
                  <>
                    <p className="colorSecondary">Showing:</p>
                    <CustomSelect
                      value={formData?.per_page}
                      name="per_page"
                      onChange={(e) => {
                        handleSelectChange('per_page', e.target.value);
                      }}
                      options={sorting}
                    />
                  </>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2">
                {search && (
                  <div className="filterWrapper d-md-flex align-items-baseline mb-0">
                    <div className="searchWrapper">
                      <CustomInput
                        type="text"
                        placeholder="Search..."
                        name="search"
                        className="searchInput mainInput"
                        value={formData?.search || ''}
                        onChange={(e) => {
                          handleSearchChange(e.target.value);
                        }}
                      />
                      <button className="searchButton notButton">
                        <LuSearch />
                      </button>
                    </div>
                  </div>
                )}
                {filters && (
                  <Dropdown
                    className="filter-dropdown"
                    show={showDropdown}
                    onToggle={(isOpen) => setShowDropdown(isOpen)}
                  >
                    <Dropdown.Toggle className="btn_filter">
                      <LuFilter />
                    </Dropdown.Toggle>

                    <Dropdown.Menu align={'end'}>
                      <h4 className="mainTitle mb-2">Filter By</h4>
                      <div className="mb-3">
                        {dateFilters?.map(({ title, from, to }, index) => {
                          return (
                            <div className="filterWrapper" key={index}>
                              {title && (
                                <label className="filterLabel w-100 mb-2">
                                  Filter By: {title}
                                </label>
                              )}
                              <CustomInput
                                label={'From'}
                                type="date"
                                placeholder="From"
                                name={from}
                                className="w-100 mb-3 mainInput"
                                value={formData[from] || ''}
                                onChange={(e) => {
                                  handleDateInputChange(from, e.target.value);
                                }}
                              />
                              <CustomInput
                                label={'To'}
                                type="date"
                                placeholder="To"
                                name={to}
                                className="w-100 mainInput"
                                value={formData[to] || ''}
                                onChange={(e) => {
                                  handleDateInputChange(to, e.target.value);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="mb-3">
                        {selectOptions?.map((option, index) => (
                          <div className="mb-3" key={index}>
                            {option ? (
                              <CustomSelect
                                name={option?.title}
                                className="mainInput w-100"
                                labelclass="mb-2"
                                value={formData[option?.title] || ''}
                                onChange={(e) => {
                                  handleChange(option?.title, e.target.value);
                                }}
                                label={`Filter by ${
                                  option?.heading ?? option?.title
                                }`}
                                options={option?.options}
                              />
                            ) : null}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 d-flex align-items-center gap-3 flex-wrap">
                        <CustomButton
                          onClick={handleApply}
                          type="button"
                          variant="primary"
                          text="Apply"
                          wrapperClassName="flex-grow-1"
                        />
                        <CustomButton
                          onClick={handleClear}
                          type="button"
                          variant="secondary"
                          className="secondaryButton"
                          wrapperClassName="flex-grow-1"
                          text="Clear"
                        />
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">{children}</div>
        {pagination && (
          <div className="col-12">
            <CustomPagination pagination={pagination} setFilters={setFilters} />
          </div>
        )}
      </div>
    </>
  );
};

export default CustomFilters;
