import axios from 'axios';
import './App.css';

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

export const createDevice = async (name, warehouse_addition_time, fee, linked_industry) => {
  const data = await axios.post(`http://localhost:5000/device`, { name, warehouse_addition_time, fee, linked_industry })
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

export const updateDevice = async (id, name, warehouse_addition_time, fee, linked_industry) => {
  const data = await axios.put(`http://localhost:5000/device/${id}`, { name, warehouse_addition_time, fee, linked_industry })
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

export const createIndustry = async (name) => {
  const data = await axios.post(`http://localhost:5000/industry`, { name })
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error(error);
    });

  //console.log(data)
  return data
}

export const updateIndustry = async (id, name) => {
  const data = await axios.put(`http://localhost:5000/industry/${id}`, { name })
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


