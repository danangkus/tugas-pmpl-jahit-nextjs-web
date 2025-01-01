"use client";

import {
  ChangeEvent,
  FC,
  Key,
  RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { DownloadIcon, PlusIcon, SearchIcon, VerticalDotsIcon } from "./icons";
import { Input } from "@nextui-org/input";
import { Pagination } from "@nextui-org/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useAsyncList } from "react-stately";
import { usePathname, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { toast } from "react-toastify";
import { API_HOST } from "@/helpers/envHelpers";
import { color } from "framer-motion";

export interface DataTableProps {
  columns: Record<string, any>[];
  endpoint: string;
  searchKey: string;
  tableRef?: RefObject<DataTableRef | null>;
  excelExport?: boolean;
  hideDelete?: boolean;
  hideCreate?: boolean;
}

export interface DataTableRef {
  reload: () => void;
}

export const DataTable: FC<DataTableProps> = ({
  columns,
  endpoint,
  searchKey,
  tableRef,
  excelExport,
  hideDelete,
  hideCreate,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [deleteId, setDeleteId] = useState<number>();
  const {
    isOpen: isOpenConfirmDelete,
    onOpen: onOpenConfirmDelete,
    onOpenChange: onOpenChangeConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useDisclosure();

  const fullActions = [
    {
      key: "lihat",
      label: "Lihat",
      onClick: (id: any) => onClickLihat(id),
    },
    {
      key: "ubah",
      label: "Ubah",
      onClick: (id: any) => onClickUbah(id),
    },
    {
      key: "hapus",
      label: "Hapus",
      onClick: (id: any) => onClickHapus(id),
      color: "danger",
    },
  ];

  const hasSearchFilter = Boolean(filterValue);
  const headerColumns = useMemo(() => {
    return columns;
  }, []);

  const list = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(cursor || API_HOST + endpoint + "/daftar", {
        signal,
      });
      let json = await res.json();

      if (!cursor) {
        setLoading(false);
      }

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(list.items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  function onClickLihat(id: number) {
    const params = new URLSearchParams();
    params.set("id", id.toString());
    router.push(`${pathname}/lihat?${params.toString()}`);
  }

  function onClickUbah(id: number) {
    const params = new URLSearchParams();
    params.set("id", id.toString());
    router.push(`${pathname}/ubah?${params.toString()}`);
  }

  function onClickHapus(id: number) {
    setDeleteId(id);
    onOpenConfirmDelete();
  }

  async function hapus() {
    const response = await fetch(
      API_HOST +
        endpoint +
        "/hapus?id=" +
        deleteId +
        "&oleh=" +
        localStorage.getItem("username"),
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      onCloseConfirmDelete();
      list.reload();
    } else {
      toast("Error!", { type: "error" });
      onCloseConfirmDelete();
    }
  }

  const filteredItems = useMemo(() => {
    let filtered = [...list.items];

    if (hasSearchFilter) {
      filtered = filtered.filter((data: any) => {
        let result = data;
        let splittedKey = searchKey.split(".");
        for (let key of splittedKey) {
          result = result[key];
        }
        return result.toLowerCase().includes(filterValue.toLowerCase());
      });
    }

    return filtered;
  }, [list.items, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items];
  }, [items]);

  const actionItems = useMemo(() => {
    let result = fullActions;
    result = result.filter((row) => {
      let rRes = true;
      if (hideDelete == true && row.key == "hapus") {
        rRes = false;
      }
      return rRes;
    });
    return result;
  }, [hideDelete]);

  function onTambah() {
    router.push(pathname + "/tambah");
  }

  useImperativeHandle(tableRef, () => ({
    reload: () => {
      list.reload();
    },
  }));

  const renderCell = useCallback((data: any, columnKey: Key) => {
    const cellValue = data[columnKey as keyof any];
    let filteredColumn = headerColumns.filter((row) => row.key == columnKey);
    if (filteredColumn.length > 0 && filteredColumn[0].render) {
      return filteredColumn[0].render(cellValue, data);
    }

    switch (columnKey) {
      case "tindakan":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu items={actionItems}>
                {(item) => (
                  <DropdownItem
                    key={item.key}
                    color={item.key === "hapus" ? "danger" : "default"}
                    className={item.key === "hapus" ? "text-danger" : ""}
                    onPress={() => item.onClick(data.id)}
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Cari"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {excelExport && (
              <Button
                color="success"
                endContent={<DownloadIcon />}
                onPress={downloadExcel}
              >
                Export Excel
              </Button>
            )}
            {hideCreate != true && (
              <Button
                color="primary"
                endContent={<PlusIcon />}
                onPress={onTambah}
              >
                Tambah Data
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    list.items.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {list.items.length} data
          </span>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          //   color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        //   isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        //   classNames={{ wrapper: "max-h-[382px]" }}
        //   selectionMode="multiple"
        topContent={topContent}
        topContentPlacement="outside"
        className="mt-5"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"Tidak ada data"}
          items={sortedItems}
          loadingContent="Memuat..."
          isLoading={loading}
        >
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        size="xs"
        isOpen={isOpenConfirmDelete}
        onOpenChange={onOpenChangeConfirmDelete}
      >
        <ModalContent>
          {(onCloseConfirmDelete) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Hapus Data?
              </ModalHeader>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseConfirmDelete}
                >
                  Batal
                </Button>
                <Button color="primary" onPress={() => hapus()}>
                  Ya
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
