import axios from "axios";

export async function reloadAdmin(adminId) {
    const postData = {
        _id: adminId
    };

    try {
        const response = await axios.post("http://localhost:3001/api/v0/search-admin", postData);
        console.log("Admin authentication response:", response.data);
        return response.data;
    } catch (error) {
        // console.log("Error authenticating admin:", error.message);
        throw error; // Rethrow the error if you want to handle it later
    }
}

export async function retrieveRequests(pendingRequestIDs) {
    try {
        const requests = pendingRequestIDs.map(async (requestID, index) => {
            const r = await axios.post(`http://localhost:3001/api/v0/retrieverequest`, { requestID });
            // const temp = { name: r.data.name };
            // console.log("temp: ", temp);
            // console.log(r.data);
            return JSON.stringify(r.data);
        });

        const response = await Promise.all(requests);
        // console.log("Response array: ", response, response.length);

        return response;
    } catch (error) {
        console.log("Error fetching requests:", error);
        throw error;
    }
}
