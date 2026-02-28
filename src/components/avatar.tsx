type AvatarProps = {
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  size?: number;
};

function stringToColor(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}

export function Avatar({ name, email, photoURL, size = 40 }: AvatarProps) {
  const text = name || email || "?";
  const letter = text.charAt(0).toUpperCase();
  const backgroundColor = stringToColor(email || text);

  const sizeStyle = {
    width: size,
    height: size,
  };

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name ?? "Avatar"}
        style={sizeStyle}
        className="rounded-full object-cover bg-slate-800"
        // className="rounded-full object-contain"
      />
    );
  }

  return (
    <div
      style={{
        ...sizeStyle,
        backgroundColor,
      }}
      className="flex items-center justify-center rounded-full text-white font-semibold select-none"
    >
      <span className="text-xl">{letter}</span>
    </div>
  );
}
