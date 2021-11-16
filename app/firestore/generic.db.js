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

  async readAll (constraints = null, ordering = null) {
    let query = this.collectionRef
    if (constraints) {
      constraints.forEach(constraint => {
        query = query.where(...constraint)
      })
    }
    if (ordering) {
      if (!ordering.dir) ordering.dir = 'desc'
      query = query.orderBy(ordering.path, ordering.dir)
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

  subscribeSnapshotListener (onSnapshot) {
    // call returned callback to unsubscribe (const a = subscribeSnapshotListener(snap=>snap.forEach(b=>b.console.log)); -- unsubscribe with a();)
    return this.collectionRef.onSnapshot(onSnapshot)
  }

  generateSnapshotCallback (mappedCallback) {
    return async snapshot => {
      console.log('on generated snapshot callback')
      let arr = []
      snapshot.forEach(docRef => {
        const doc = {
          id: docRef.id,
          ...docRef.data()
        }
        arr.push(this.saltDocument(doc))
      })
      arr = await Promise.all(arr)
      arr.sort((a, b) => {
        return a.sent_at < b.sent_at ? -1 : 1
      })
      mappedCallback(arr)
    }
  }

  async saltDocument (doc) {
    return doc
  }

  simpleSub (mapped) {
    return this.subscribeSnapshotListener(this.generateSnapshotCallback(mapped))
  }
}
