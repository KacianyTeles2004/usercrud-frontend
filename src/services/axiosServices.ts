import axiosInstance from "../api/axiosConfig";

export const cadastrarUsuario = async (data: any) => {
    try {
        const response = await axiosInstance.post('/usuario/cadastrar', data);
        return response.data;
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        throw error;
    }
};

export const buscarUsuarioPorId = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/usuario/buscar/${id}`);
        return response.data;
    }
    catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
};

export const cadastrarProduto = async (data: any) => {
    try {
        const response = await axiosInstance.post('/produto/cadastrar', data);
        return response.data;
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        throw error;
    }
};

export const statusProduto = async (id: number) => {
    try {
        const response = await axiosInstance.put(`/produto/${id}/alterarStatus`, id);
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar status do produto:', error);
        throw error;
    }
}

export const listarProdutos = async (page: number, size: number) => {
    const response = await axiosInstance.get(`/produto/listarTodos`, {
        params: {
            page,
            size,
            sort: 'id,desc',
        },
    });
    return response.data;
};

export const listarProdutoPorId = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/produto/buscarProduto/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar produto:', error);
        throw error;
    }
}

export const listarUsuarios = async () => {
    try {
        const response = await axiosInstance.get('/usuario/listarTodos');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        throw error;
    }
};

export const statusUsuario = async (user: any) => {
    try {
        const response = await axiosInstance.put(`/usuario/editar/${user.id}`, {
            ...user,
            ativo: !user.ativo,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar status do usuário:', error);
        throw error;
    }
};

export const editarUsuario = async (id: number, data: any) => {
    try {
        const response = await axiosInstance.put(`/usuario/editar/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        throw error;
    }
};

export const editarProduto = async (id: number, data: any) => {
    try {
        const response = await axiosInstance.put(`/produto/${id}/alterar`, data);
        return response.data;
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        throw error;
    }
}

export const authUser = async (data: any) => {
    try {
        const response = await axiosInstance.post('/auth/login', data);
        return response.data;
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        throw error;
    }
}

export const calculaFrete = (cep: string) => {
    try {
        const response = axiosInstance.get(`/frete/${cep}/calcular`);
        return response;
    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        throw error;
    }
}

export const uploadImagens = async (produtoId: number, formData: FormData) => {
    return axiosInstance.post(`/imagens/${produtoId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateImagens = async (produtoId: number, formData: FormData) => {
    return axiosInstance.put(`/imagens/${produtoId}/update_imagens`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
