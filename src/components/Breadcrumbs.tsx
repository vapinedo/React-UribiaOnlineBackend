import { v4 as createUuid } from 'uuid';
import { Link, NavLink, useLocation } from "react-router-dom";
import React from 'react';

const uuidRegex = /^[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}$/i;

export default function Breadcrumbs() {

    const { pathname } = useLocation();
    const crumbsArr = pathname.split("/").filter(crumb => crumb !== "");
    const noUUIDCrumbsArr = crumbsArr.filter(crumb => !uuidRegex.test(crumb));
    let breadcrumbs = "";

    if (noUUIDCrumbsArr.length < 1) {
        return null;
    }

    return (
        <nav className="breadcrumbs">
            {noUUIDCrumbsArr.length > 0 && (
                <>
                    <Link to="/">Inicio</Link>
                    <i className='bx bx-chevron-right'></i>
                </>
            )}
            {noUUIDCrumbsArr.map((name: string, index: number) => {
                const uuid = createUuid();
                breadcrumbs += `/${name}`;
                const isLast = index === noUUIDCrumbsArr.length - 1;
                return isLast
                    ? <a key={uuid} className="text-secondary">{name}</a>
                    : (
                        <React.Fragment key={uuid}>
                            <NavLink to={breadcrumbs}>{name}</NavLink>
                            <i className='bx bx-chevron-right'></i>
                        </React.Fragment>
                    )
            })}
        </nav>
    )
}