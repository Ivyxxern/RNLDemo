import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import UserService from "../../../services/UserService";
import Spinner from "../../../components/Spinner/Spinner";
import type { UserColumns } from "../../../interfaces/UserInterface";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { toAbsoluteMediaUrl } from "../../../utils/mediaUrl";

interface UserListProps {
  onAddUser: () => void;
  onEditUser: (user: UserColumns | null) => void;
  onDeleteUser: (user: UserColumns | null) => void;
  refreshKey: boolean;
}

const UserList: FC<UserListProps> = ({ onAddUser, onEditUser, onDeleteUser, refreshKey }) => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<UserColumns[]>([]);
  const [usersTableCurrentPage, setUsersTableCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [brokenProfileImages, setBrokenProfileImages] = useState<Record<number, true>>({});

  const tableRef = useRef<HTMLDivElement>(null);
  const loadUsersInFlightRef = useRef(false);

  const handleLoadUsers = useCallback(async (page: number, append = false, search: string) => {
    if (loadUsersInFlightRef.current) return;
    loadUsersInFlightRef.current = true;
    try {
      setLoadingUsers(true);

      const res = await UserService.loadUsers(page, search);

      if (res.status === 200) {
        const usersData = res.data.users.data || res.data.users || [];
        const lastPage =
          res.data.users.last_page ||
          res.data.last_page ||
          1;

        setUsers((prev) => (append ? [...prev, ...usersData] : usersData));
        setUsersTableCurrentPage(page);
        setHasMore(page < lastPage);
      } else {
        setUsers((prev) => (append ? prev : []));
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading users: ",
        error
      );
    } finally {
      setLoadingUsers(false);
      loadUsersInFlightRef.current = false;
    }
  }, [search]);

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 48 &&
      hasMore &&
      !loadingUsers
    ) {
      void handleLoadUsers(usersTableCurrentPage + 1, true, debouncedSearch);
    }
  }, [
    debouncedSearch,
    handleLoadUsers,
    hasMore,
    loadingUsers,
    usersTableCurrentPage,
  ]);

  const handleUserFullNameFormat = (user: UserColumns) => {
    let fullName = "";

    if (!user.middle_name) {
      fullName = `${user.last_name}, ${user.first_name}`;
    } else if (user.middle_name) {
      fullName = `${user.last_name}, ${user.first_name} ${user.middle_name.charAt(0)}.`;
    }

    // Doe, John

    if (user.suffix_name) {
      fullName += ` ${user.suffix_name}`;
    }

    // Doe, John Jr.

    return fullName;
  };

  useEffect(() => {
    const ref = tableRef.current;

    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setUsers([]);
    setUsersTableCurrentPage(1)
    setHasMore(true)
    setBrokenProfileImages({});

    handleLoadUsers(1, false, debouncedSearch);
  }, [refreshKey, debouncedSearch]);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div>
        <div
          ref={tableRef}
          className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-x-auto"
        >
          <Table>
            <caption className="mb-4">
              <div className="border-b border-gray-100">
                <div className="p-4 flex justify-between">
                  <div className="w-64">
                    <FloatingLabelInput
                      label="Search"
                      type="text"
                      name="search"
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-lg transition hover:bg-blue-700"
                    onClick={onAddUser}
                  >
                    Add User
                  </button>
                </div>
              </div>
            </caption>
            <TableHeader className="bg-blue-600 text-white border-b border-gray-200 text-xs z-10">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  colSpan={2}
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Gender
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Birth Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Age
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-sm text-gray-500">
              {(users.length ?? 0) > 0 ? (
                users.map((user, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3 items-end justify-end">
                      {user.profile_picture && !brokenProfileImages[user.user_id] ? (
                        <img
                          src={toAbsoluteMediaUrl(user.profile_picture) ?? ""}
                          alt={handleUserFullNameFormat(user)}
                          className="object-cover w-10 h-10 rounded-full"
                          onError={() =>
                            setBrokenProfileImages((prev) => ({
                              ...prev,
                              [user.user_id]: true,
                            }))
                          }
                        />
                      ) : (
                        <div className="relative inline-flex items-center justify-center w-10 h-10 text-center text-sm
                        overflow-hidden bg-gray-300 rounded-full">
                          <span className="font-medium text-gray-600">
                            {`${user.last_name.charAt(
                              0
                            )}${user.first_name.charAt(0)}`}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {handleUserFullNameFormat(user)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.gender.gender}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.birth_date?.split("T")[0]}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.age}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="text-green-600 font-medium cursor-pointer hover:underline"
                          onClick={() => onEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 font-medium cursor-pointer hover:underline"
                          onClick={() => onDeleteUser(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loadingUsers && (users.length ?? 0) <= 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-3 text-center font-medium">
                    No Records Found
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
              {loadingUsers && (users.length ?? 0) > 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
