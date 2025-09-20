type PackageType = {
  name: string;
  id: string;
};

type UserType = {
  package?: 'free' | 'standard' | 'premium';
  roleDetail?: {
    name: string;
  };
};

const list: PackageType[] = [
  { name: 'Free', id: 'free' },
  { name: 'Standard', id: 'standard' },
  { name: 'Premium', id: 'premium' },
];

const name = (id: string): string => {
  const ext = list.find((itm) => itm.id === id);
  return ext ? ext.name : '--';
};

const check = (dp: 'free' | 'standard' | 'premium', u: UserType | null = null): boolean => {
  let up: 'free' | 'standard' | 'premium' | '' = '';

  const user = u ?? null;
  if (user) {
    up = user.package ?? 'standard';
  }

  if (user?.roleDetail?.name === 'admin') {
    up = 'premium';
  }

  let value = false;
  if (up === 'free' || !up) {
    if (dp === 'free') value = true;
  } else if (up === 'standard') {
    if (dp === 'free' || dp === 'standard') value = true;
  } else if (up === 'premium') {
    value = true;
  }

  return value;
};

const packageModel = { list, name, check };
export default packageModel;
