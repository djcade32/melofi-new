import { initializeApp, getApps, deleteApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    projectId: "test-project", // Replace with your project ID
  });
}

const firestore = getFirestore();

async function clearFirestore() {
  const collections = await firestore.listCollections();

  for (const collection of collections) {
    console.log(`Deleting documents in collection: ${collection.id}`);
    const snapshot = await collection.get();

    // Delete each document in the collection
    const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);
  }

  console.log("Firestore has been cleared!");
}

// Clear Firestore and clean up
clearFirestore()
  .then(async () => {
    console.log("Clearing completed.");
    if (getApps().length) {
      await deleteApp(getApps()[0]); // Cleanup Firebase app
      console.log("Firebase app deleted.");
    }
  })
  .catch((error) => {
    console.error("Error clearing Firestore:", error);
  });
