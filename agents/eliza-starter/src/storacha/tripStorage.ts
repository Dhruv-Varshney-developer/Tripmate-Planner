import { elizaLogger, HandlerCallback, Memory, State } from "@elizaos/core";
import { StorageClientImpl } from "@storacha/elizaos-plugin";

export async function storeTripData(state : State, callback : HandlerCallback, storageClient ) {
  const tripData = state.recentMessages;
        // console.log(`tripData=`, tripData)
      
        if (!tripData) {
          await callback?.({ text: "Invalid or missing trip data." });
          return;
        }

        const jsonString = JSON.stringify(tripData);
        // console.log(`json trip data=`, jsonString);
        const blob = new Blob([jsonString]);
        const file = new File([blob], `${state.actorsData[0].username}-TripData.json`, { type: "application/json" });
        
        try {
          const cid = await storageClient.getStorage().uploadFile(file);
          await callback?.({ text: `Trip data saved! Here is the link: https://${cid}.ipfs.w3s.link/ ` });
          return cid;
        } catch (error) {
          console.log(`error in storeTripData--`, error)
          await callback?.({ text: "Error uploading trip data." });
        }
}

export async function retrieveTripData( message: Memory, state : State, callback : HandlerCallback, storageClient){
  const cid = await storeTripData(state, callback, storageClient)
  if (!cid || typeof cid !== 'string') {
    await callback?.({ text: "Invalid or missing CID." });
    return;
  }

  try {
    const data = await storageClient.getContent(cid);
    await callback?.({ text: `Here’s your trip data : ${data.toString()}` });
    return data;
  } catch (error) {
    await callback?.({ text: "Error retrieving trip data." });
    console.log(error);
  }
}