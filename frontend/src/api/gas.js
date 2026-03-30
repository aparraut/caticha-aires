import axios from 'axios';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyy_43050krzygyXyo5OWT26LTdgZ54o49xLKXlHCTqPf7HUj3tXbLHqTo_zxfrdQCikw/exec';

/**
 * Submit a service request to the GAS backend.
 * @param {Object} data - { name, whatsapp, zone, service, description }
 */
export const submitRequest = async (data) => {
  try {
    const response = await axios.post(GAS_URL, JSON.stringify(data), {
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting request:', error);
    throw error;
  }
};

/**
 * Fetch all requests (for admin).
 */
export const getRequests = async () => {
  try {
    const response = await axios.get(GAS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

/**
 * Update request status (to be implemented in GAS later if needed).
 * For now, we manually manage via sheet if GAS doesn't support PATCH yet.
 */
export const updateStatus = async (id, status) => {
  // GAS backend might need a specific action parameter for this.
  // We'll stick to GET/POST for now as per current GAS code.
  console.warn('Update status not fully implemented in GAS backend yet.');
};
