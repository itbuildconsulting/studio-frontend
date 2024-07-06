import Cookies from 'js-cookie';

async function conectAPI(url: string, method: string) {
  const token = Cookies.get('admin-user-sci-auth');
  
  try {
    const resp: any = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL_API}${url}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      }
    );

    if (resp.status === 200) {
      const authResp: any = await resp.json();

      return authResp;
    } else {
      const error = await resp.json();
      throw new Error(JSON.stringify(error));
    }
  } catch (error) {
    return error;
  }
}

export default class DropDownsRepository implements DropDownsRepository {
  async dropdown(name: string): Promise<[]> {
    const req: any = {};
    return conectAPI(`/${name}`, "GET");
  }
}
