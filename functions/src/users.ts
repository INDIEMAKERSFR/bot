import {getFirestore, DocumentReference} from "firebase-admin/firestore";

export const voteIfNotDone = (personId: string, uid: string) => {
  const voteRef = getFirestore().collection(`/people/${personId}/votes`).doc(uid);
  return voteRef
      .get()
      .then((docSnapshot): Promise<{ error: string } | { done: string }> => {
        if (docSnapshot.exists) {
          return Promise.resolve({error: "Already voted"});
        }
        return voteRef
            .set({date: Date()})
            .then(() => ({done: "Voted"}))
            .catch(() => ({error: "Fail vote"}));
      })
      .catch((err: any) => {
        console.error("Fail vote", err);
        return {error: "Fail vote"};
      });
};

export const getPerson = async (idStr: string): Promise<DocumentReference | null> => {
  const person = await getFirestore()
      .collection("people")
      .where("id_str", "==", idStr)
      .get()
      .then((snapshot) => {
        let result: DocumentReference | null = null;
        if (snapshot.empty) {
          console.error("No matching person", idStr);
          return null;
        }
        snapshot.forEach((doc) => {
          console.error(doc.id, "=>", doc.data());
          result = doc.ref;
        });
        return result;
      })
      .catch((err) => {
        console.error("Error getting person", err);
        return null;
      });
  console.error("Person", person);
  return person;
};
