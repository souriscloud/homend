import { firestore } from '@nativescript/firebase'

export default class GenericDb {
  constructor (collectionPath) {
    this.collectionPath = collectionPath
    this.collectionRef = firestore.collection(this.collectionPath)
  }

  async create (data, id = null) {
    // maybe add timestamps?

    const createPromise = id === null ? this.collectionRef.add(data).then(doc => doc.id) : this.collectionRef.doc(id).set(data).then(() => id)
    const docId = await createPromise

    return {
      id: docId,
      ...data
    }
  }

  async read (id) {
    const result = await this.collectionRef.doc(id).get()
    return result.exists ? {
      id,
      ...result.data()
    } : null
  }

  async readAll (constraints = null) {
    let query = this.collectionRef
    if (constraints) {
      constraints.forEach(constraint => {
        query = query.where(...constraint)
      })
    }

    const result = await query.get()
    return result.docs.map(docRef => {
      return {
        id: docRef.id,
        ...docRef.data()
      }
    })
  }

  async update (id, data) {
    await this.collectionRef.doc(id).update(data)

    return id
  }

  async delete (id) {
    return await this.collectionRef.doc(id).delete()
  }
}
