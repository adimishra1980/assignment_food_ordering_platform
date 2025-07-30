interface MenuItemProps {
  name: string;
  price: number;
  image_url: string;
}

const MenuItem = ({ name, price, image_url }: MenuItemProps) => {
  return (
    <a 
    href=""
    className="menu-item">
      <div>
        <img
          src={image_url}
          alt={name}
          className="w-[80vh] h-[25vh] object-cover rounded-xl"
        />
      </div>
      <div className="mt-3 mx-3">
          <h3 className="text-xl font-semibold ">{name}</h3>
          <h3 className="text-xl font-semibold">₹ {price}</h3>
      </div>
    </a>
  );
};

export default MenuItem;
