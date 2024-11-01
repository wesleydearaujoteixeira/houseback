export const RemoveSomethingOntheString = (uer_id: string | null) => {
    const userIdValid = uer_id ? uer_id.replace(/"/g, '') : "";
    return userIdValid;

  }