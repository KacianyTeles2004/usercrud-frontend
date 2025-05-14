import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useKeenSlider, KeenSliderInstance } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck } from 'lucide-react';
import { Button } from '../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFloating, FloatingPortal, offset, flip, shift } from '@floating-ui/react';
import { listarProdutoPorId } from '../services/axiosServices';
import { adicionarAoCarrinho } from './utils/carrinhoUtils';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  background: none;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  transition: color 0.2s;

  &:hover {
    color: #0f172a;
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  min-height: 700px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const GalleryContainer = styled.div`
  position: relative;
  background: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
  
  .keen-slider {
    height: 700px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Thumbnail = styled.button<{ active: boolean }>`
  width: 80px;
  height: 80px;
  padding: 0;
  border: 2px solid ${props => props.active ? '#A23F3F' : 'transparent'};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  opacity: ${props => props.active ? 1 : 0.6};
  transition: all 0.2s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    opacity: 1;
  }
`;

const ProductInfo = styled.div`
  padding: 2rem;
`;

const Category = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #0f172a;
  margin: 0 0 1rem;
  font-weight: 600;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const RatingText = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const Price = styled.div`
  font-size: 2rem;
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Description = styled.p`
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2rem 0;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  margin-top: 2rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #A23F3F;
    color: #A23F3F;
  }
`;

const DeliveryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 2rem;

  svg {
    color: #A23F3F;
  }
`;

const ShareTooltip = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

export default function DetalhesProduto() {
    const { id } = useParams<{ id: string }>();
    const [produto, setProduto] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const navigate = useNavigate();

    const { refs, floatingStyles } = useFloating({
        placement: 'top',
        middleware: [offset(10), flip(), shift()],
    });

    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        slideChanged(slider: KeenSliderInstance) {
            setCurrentSlide(slider.track.details.rel);
        },
    });

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const produtoEncontrado = await listarProdutoPorId(Number(id));
                setProduto(produtoEncontrado);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduto();
    }, [id]);

    if (loading) return <Container>Loading...</Container>;
    if (!produto) return <Container>Product not found!</Container>;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                size={18}
                fill={index < rating ? '#FFB800' : 'none'}
                color={index < rating ? '#FFB800' : '#CBD5E1'}
            />
        ));
    };

    const addToCart = () => {
      if (!produto) return;

      // Obter imagem principal ou a primeira disponível
      const imagemPrincipal = produto.imagens?.find((img: any) => img.imagemPrincipal);
      const imagemUrl = imagemPrincipal?.conteudo
          ? `data:image/jpeg;base64,${imagemPrincipal.conteudo}`
          : produto.imagens?.length > 0
              ? `data:image/jpeg;base64,${produto.imagens[0].conteudo}`
              : 'https://placehold.co/100';

      // Usar a função adicionarAoCarrinho do carrinhoUtils
      adicionarAoCarrinho({
          id: produto.id,
          nome: produto.nomeProduto,
          preco: produto.preco,
          imagem: imagemUrl
      });

      toast.success('Produto adicionado ao carrinho!');
  };

  const handleShare = () => {
      setShowShareTooltip(!showShareTooltip);
  };


    return (
        <Container>
            <BackButton onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
                Voltar para produtos
            </BackButton>

            <ProductLayout>
                <GalleryContainer>
                    <div ref={sliderRef} className="keen-slider">
                        {produto.imagens.map((img: any, idx: number) => (
                            <div key={idx} className="keen-slider__slide">
                                <img src={`data:image/jpeg;base64,${img.conteudo} ` || "https://placehold.co/550x550/orange/white"} alt={`${produto.nomeProduto} - View ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                    <ThumbnailContainer>
                        {produto.imagens.map((img: any, idx: number) => (
                            <Thumbnail
                                key={idx}
                                active={currentSlide === idx}
                                onClick={() => instanceRef.current?.moveToIdx(idx)}
                            >
                                <img src={`data:image/jpeg;base64,${img.conteudo} ` || "https://placehold.co/50x50/orange/white"} alt={`Thumbnail ${idx + 1}`} />
                            </Thumbnail>
                        ))}
                    </ThumbnailContainer>
                </GalleryContainer>

                <ProductInfo>
                    <Category>{produto.category}</Category>
                    <Title>{produto.nomeProduto}</Title>

                    <Rating>
                        {renderStars(produto.avaliacao)}
                        <RatingText>{produto.avaliacao} · {produto.reviews || 0} avaliações</RatingText>
                    </Rating>

                    <Price>R$ {produto.preco.toFixed(2)}</Price>
                    <Description>{produto.descricao}</Description>

                    <DeliveryInfo>
                        <Truck size={24} />
                        <div>
                            <strong>Envio gratuito</strong>
                            <p>Insira seu CEP para calcular prazo de entrega</p>
                        </div>
                    </DeliveryInfo>

                    <Divider />

                    <ActionButtons>
                        <Button onClick={addToCart}>
                            <ShoppingCart size={20} />
                            Adicionar ao carrinho
                        </Button>
                        <IconButton>
                            <Heart size={20} />
                        </IconButton>
                        <IconButton ref={refs.setReference} onClick={handleShare}>
                            <Share2 size={20} />
                        </IconButton>
                    </ActionButtons>

                    {showShareTooltip && (
                        <FloatingPortal>
                            <ShareTooltip ref={refs.setFloating} style={floatingStyles}>
                                Compartilhar este produto
                            </ShareTooltip>
                        </FloatingPortal>
                    )}
                </ProductInfo>
            </ProductLayout>
            <ToastContainer />
        </Container>
    );
}