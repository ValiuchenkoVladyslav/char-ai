import { Menu as _Menu, MenuItem as _MenuItem } from "@szhsin/react-menu";

namespace Menu {
  export interface Props
    extends Omit<PropsOf<typeof _Menu>, "menuClassName" | "menuButton"> {
    trigger: React.ComponentProps<typeof _Menu>["menuButton"];
  }
}

export function Menu({ className, trigger, ...props }: Menu.Props) {
  return (
    <_Menu
      menuClassName={`menu ${className}`}
      menuButton={trigger}
      {...props}
    />
  );
}

export function MenuSeparator() {
  return <hr className="my-1.5 block" />;
}

/** does close the menu when clicked */
export function MenuItem({ className, ...props }: PropsOf<typeof _MenuItem>) {
  return <_MenuItem className={`menu-item ${className}`} {...props} />;
}

/** unlike `MenuItem`, does not close the menu when clicked */
export function MenuBtn({ className, ...props }: PropsOf<"button">) {
  return (
    <button type="button" className={`menu-item ${className}`} {...props} />
  );
}
