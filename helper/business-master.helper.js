const calculateEmployeeWorkStatus = (record) => {
  const { employeeStatus, endDate, startDate, businessUnitStatus } = record;

  let employeeWorkStatus = determineInitialStatus(employeeStatus, endDate);
  employeeWorkStatus = updateStatusForIdle(
    employeeStatus,
    startDate,
    endDate,
    employeeWorkStatus
  );
  employeeWorkStatus = updateStatusForRelieved(
    employeeStatus,
    businessUnitStatus,
    employeeWorkStatus
  );

  return employeeWorkStatus;
};

const determineInitialStatus = (employeeStatus, endDate) => {
  if (employeeStatus === 1 && !endDate) {
    return 'Active';
  } else if (employeeStatus === 1 && endDate) {
    return 'Done';
  }
  return 'Active-Idle';
};

const updateStatusForIdle = (
  employeeStatus,
  startDate,
  endDate,
  currentStatus
) => {
  if (isActiveIdle(employeeStatus, startDate, endDate)) {
    return 'Active-Idle';
  }
  return currentStatus;
};

const isActiveIdle = (employeeStatus, startDate, endDate) => {
  return employeeStatus === 2 && !startDate && !endDate;
};

const updateStatusForRelieved = (
  employeeStatus,
  businessUnitStatus,
  currentStatus
) => {
  if (employeeStatus === 0 && businessUnitStatus === 'Served') {
    return 'Releived';
  }
  return currentStatus;
};

export { calculateEmployeeWorkStatus };
