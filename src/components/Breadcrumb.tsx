import Link from "next/link";
import { Fragment } from "react";

type Props={
  links:[
    {
      name:string;
      link:string;
    }
  ];
  currentPage:string;
  className?:string;
}

const Breadcrumb = ({ links, currentPage = "", className="px-4 lg:px-10 2xl:px-16 pt-3" }:Props) => {
  return (
    <>
      <div className={`${className}`}>
        <div className="flex items-center gap-2 font-medium">
          {links.map((itm,i) => {
            return (
              <Fragment key={i}>
                <Link className="text-[#605F5F] text-sm xl:text-md" href={itm.link}>
                  {itm.name}
                </Link>
                <span className="material-symbols-outlined">keyboard_arrow_right</span>
              </Fragment>
            );
          })}
          <p className="text-black text-sm xl:text-md active">{currentPage}</p>
        </div>
      </div>
    </>
  );
};

export default Breadcrumb;
