import axios from 'axios';

export const fetchDevices = async () => {
  const data = await axios.get('http://localhost:5000/device')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });

  //console.log(data)
  return data
}

export const fetchDevice = async (deviceId) => {
  const data = await axios.get(`http://localhost:5000/device/${deviceId}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
      // Handle any errors here
      console.error(error);
    });

  //console.log(data)
  return data
}

export const createDevice = async (newDevice) => {
  const data = await axios.post(`http://localhost:5000/device`, {
    name: newDevice.name,
    warehouse_addition_time: newDevice.warehouse_addition_time,
    fee: newDevice.fee,
    linked_industry: newDevice.linked_industry
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      // Handle any errors here
      console.error(error);
    });

  //console.log(data)
  return data
}

export const updateDevice = async (updatedDevice) => {
  const data = await axios.put(`http://localhost:5000/device/${updatedDevice.id}`, {
    name: updatedDevice.name,
    warehouse_addition_time: updatedDevice.warehouse_addition_time,
    fee: updatedDevice.fee,
    linked_industry: updatedDevice.linked_industry
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      // Handle any errors here
      console.error(error);
    });

  //console.log(data)
  return data
}

export const deleteDevice = async (id) => {
  const data = await axios.delete(`http://localhost:5000/device/${id}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
      // Handle any errors here
      console.error(error);
    });

  //console.log(data)
  return data
}


export const fetchIndustries = async () => {
  const data = await axios.get('http://localhost:5000/industry')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });

  //console.log(data)
  return data
}

export const fetchIndustry = async (industryId) => {
  const data = await axios.get(`http://localhost:5000/industry/${industryId}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error(error);
    });

  //console.log(data)
  return data
}

export const createIndustry = async (newIndustry) => {
  const data = await axios.post(`http://localhost:5000/industry`, { name: newIndustry.name })
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error(error);
    });

  //console.log(data)
  return data
}

export const updateIndustry = async (updatedIndustry) => {
  const data = await axios.put(`http://localhost:5000/industry/${updatedIndustry.id}`, { name: updatedIndustry.name })
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error(error);
    });

  //console.log(data)
  return data
}

export const deleteIndustry = async (id) => {
  const data = await axios.delete(`http://localhost:5000/industry/${id}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error(error);
    });

  //console.log(data)
  return data
}


